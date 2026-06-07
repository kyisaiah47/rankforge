import { NextResponse } from "next/server";
import { getPlayerRank } from "@/lib/dynamodb";

type Period = "all" | "daily" | "weekly" | "monthly";
const VALID_PERIODS: Period[] = ["all", "daily", "weekly", "monthly"];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ gameId: string; playerId: string }> }
) {
  const { gameId, playerId } = await params;
  const { searchParams } = new URL(request.url);
  const period = (searchParams.get("period") ?? "all") as Period;

  if (!VALID_PERIODS.includes(period)) {
    return NextResponse.json({ error: "invalid period" }, { status: 400 });
  }

  const result = await getPlayerRank(gameId, playerId, period);
  if (!result) {
    return NextResponse.json(
      { error: "Player not found in this leaderboard" },
      { status: 404 }
    );
  }

  return NextResponse.json({ gameId, playerId, period, ...result });
}
