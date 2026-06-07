import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION ?? "us-east-1",
  credentials:
    process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
      ? {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
      : undefined, // falls back to instance role / env chain in prod
});

export const db = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});

export const TABLE = process.env.DYNAMODB_TABLE_NAME ?? "rankforge";

// ─── Key helpers ────────────────────────────────────────────────────────────

const gameKey = (gameId: string) => ({ PK: `GAME#${gameId}`, SK: "#META" });
const scoreKey = (gameId: string, playerId: string) => ({
  PK: `GAME#${gameId}`,
  SK: `PLAYER#${playerId}`,
});
const periodScoreKey = (gameId: string, period: string, playerId: string) => ({
  PK: `GAME#${gameId}#${period}`,
  SK: `PLAYER#${playerId}`,
});

// GSI key — leaderboard queries sort by score via GSI1SK
const gsi1 = (gameId: string, period: string) =>
  `LEADERBOARD#${gameId}#${period}`;

export function getPeriodKey(period: "daily" | "weekly" | "monthly" | "all") {
  const now = new Date();
  if (period === "all") return "ALL";
  if (period === "daily") return `DAILY#${now.toISOString().slice(0, 10)}`;
  if (period === "weekly") {
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const week = Math.ceil(
      ((now.getTime() - startOfYear.getTime()) / 86400000 +
        startOfYear.getDay() +
        1) /
        7
    );
    return `WEEKLY#${now.getFullYear()}-W${String(week).padStart(2, "0")}`;
  }
  // monthly
  return `MONTHLY#${now.toISOString().slice(0, 7)}`;
}

// ─── Game operations ─────────────────────────────────────────────────────────

export interface Game {
  gameId: string;
  name: string;
  description: string;
  apiKey: string;
  createdAt: string;
  scoreCount: number;
}

export async function createGame(
  name: string,
  description: string
): Promise<Game> {
  const gameId = uuidv4().replace(/-/g, "").slice(0, 12);
  const apiKey = `rf_${uuidv4().replace(/-/g, "")}`;
  const game: Game = {
    gameId,
    name,
    description,
    apiKey,
    createdAt: new Date().toISOString(),
    scoreCount: 0,
  };
  await db.send(
    new PutCommand({
      TableName: TABLE,
      Item: { ...gameKey(gameId), ...game },
      ConditionExpression: "attribute_not_exists(PK)",
    })
  );
  return game;
}

export async function getGame(gameId: string): Promise<Game | null> {
  const res = await db.send(
    new GetCommand({ TableName: TABLE, Key: gameKey(gameId) })
  );
  if (!res.Item) return null;
  return res.Item as Game;
}

export async function getGameByApiKey(apiKey: string): Promise<Game | null> {
  // GSI2: apiKey → game lookup
  const res = await db.send(
    new QueryCommand({
      TableName: TABLE,
      IndexName: "apiKey-index",
      KeyConditionExpression: "apiKey = :k",
      ExpressionAttributeValues: { ":k": apiKey },
      Limit: 1,
    })
  );
  if (!res.Items?.length) return null;
  return res.Items[0] as Game;
}

// ─── Score operations ─────────────────────────────────────────────────────────

export interface ScoreEntry {
  playerId: string;
  playerName: string;
  score: number;
  updatedAt: string;
  gameId: string;
}

const TTL_SECONDS: Record<string, number> = {
  DAILY: 60 * 60 * 48,      // 48h
  WEEKLY: 60 * 60 * 24 * 14, // 2 weeks
  MONTHLY: 60 * 60 * 24 * 62, // ~2 months
};

export async function submitScore(
  gameId: string,
  playerId: string,
  playerName: string,
  score: number
): Promise<void> {
  const now = new Date().toISOString();
  const periods: Array<"all" | "daily" | "weekly" | "monthly"> = [
    "all",
    "daily",
    "weekly",
    "monthly",
  ];

  // Transactional write: update score for all time windows atomically
  const transactItems = periods.map((p) => {
    const periodKey = getPeriodKey(p);
    const isAll = p === "all";
    const key = isAll
      ? scoreKey(gameId, playerId)
      : periodScoreKey(gameId, periodKey, playerId);
    const ttlSeconds = isAll
      ? undefined
      : TTL_SECONDS[periodKey.split("#")[0]];
    const ttl = ttlSeconds
      ? Math.floor(Date.now() / 1000) + ttlSeconds
      : undefined;

    return {
      Put: {
        TableName: TABLE,
        Item: {
          ...key,
          GSI1PK: gsi1(gameId, periodKey),
          GSI1SK: score,
          playerId,
          playerName,
          score,
          gameId,
          updatedAt: now,
          ...(ttl ? { ttl } : {}),
        },
        // Only update if new score is higher than existing
        ConditionExpression:
          "attribute_not_exists(score) OR score < :newScore",
        ExpressionAttributeValues: { ":newScore": score },
      },
    };
  });

  // TransactWrite fails if any condition fails — swallow ConditionalCheckFailed
  // (score not beaten) gracefully per-period by splitting into individual puts
  await Promise.all(
    transactItems.map(async (item) => {
      try {
        await db.send(
          new TransactWriteCommand({ TransactItems: [item] })
        );
      } catch (e: unknown) {
        const err = e as { name?: string };
        if (
          err.name !== "TransactionCanceledException" &&
          err.name !== "ConditionalCheckFailedException"
        ) {
          throw e;
        }
      }
    })
  );
}

export async function getLeaderboard(
  gameId: string,
  period: "all" | "daily" | "weekly" | "monthly",
  limit = 100
): Promise<(ScoreEntry & { rank: number })[]> {
  const periodKey = getPeriodKey(period);
  const res = await db.send(
    new QueryCommand({
      TableName: TABLE,
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :pk",
      ExpressionAttributeValues: { ":pk": gsi1(gameId, periodKey) },
      ScanIndexForward: false, // descending score
      Limit: limit,
    })
  );
  return (res.Items ?? []).map((item, i) => ({
    ...(item as ScoreEntry),
    rank: i + 1,
  }));
}

export async function getPlayerRank(
  gameId: string,
  playerId: string,
  period: "all" | "daily" | "weekly" | "monthly"
): Promise<{ rank: number; score: number; total: number } | null> {
  const periodKey = getPeriodKey(period);

  // Get player's score
  const isAll = period === "all";
  const key = isAll
    ? scoreKey(gameId, playerId)
    : periodScoreKey(gameId, periodKey, playerId);
  const playerRes = await db.send(
    new GetCommand({ TableName: TABLE, Key: key })
  );
  if (!playerRes.Item) return null;
  const playerScore = playerRes.Item.score as number;

  // Count how many players have a higher score (rank = that count + 1)
  const aboveRes = await db.send(
    new QueryCommand({
      TableName: TABLE,
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :pk AND GSI1SK > :score",
      ExpressionAttributeValues: {
        ":pk": gsi1(gameId, periodKey),
        ":score": playerScore,
      },
      Select: "COUNT",
    })
  );

  const totalRes = await db.send(
    new QueryCommand({
      TableName: TABLE,
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :pk",
      ExpressionAttributeValues: { ":pk": gsi1(gameId, periodKey) },
      Select: "COUNT",
    })
  );

  return {
    rank: (aboveRes.Count ?? 0) + 1,
    score: playerScore,
    total: totalRes.Count ?? 0,
  };
}
