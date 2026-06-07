import { NextResponse } from "next/server";
import { createGame, db, TABLE } from "@/lib/dynamodb";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description = "" } = body;
    if (!name?.trim()) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }
    const game = await createGame(name.trim(), description.trim());
    return NextResponse.json(game, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create game" }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Scan for all game metadata items — fine at hackathon scale
    const res = await db.send(
      new ScanCommand({
        TableName: TABLE,
        FilterExpression: "SK = :meta",
        ExpressionAttributeValues: { ":meta": "#META" },
      })
    );
    const games = (res.Items ?? []).map((item) => ({
      gameId: item.gameId,
      name: item.name,
      description: item.description,
      createdAt: item.createdAt,
      scoreCount: item.scoreCount ?? 0,
    }));
    games.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return NextResponse.json({ games });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to list games" }, { status: 500 });
  }
}
