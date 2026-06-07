import { NextResponse } from "next/server";
import { validateApiKey } from "@/lib/auth";
import { submitScore } from "@/lib/dynamodb";

export async function POST(request: Request) {
  const game = await validateApiKey(request);
  if (!game) {
    return NextResponse.json({ error: "Invalid or missing API key" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { playerId, playerName, score } = body;

    if (!playerId?.trim() || !playerName?.trim()) {
      return NextResponse.json(
        { error: "playerId and playerName are required" },
        { status: 400 }
      );
    }
    if (typeof score !== "number" || !Number.isFinite(score)) {
      return NextResponse.json(
        { error: "score must be a finite number" },
        { status: 400 }
      );
    }

    await submitScore(game.gameId, playerId.trim(), playerName.trim(), score);
    return NextResponse.json({ ok: true, gameId: game.gameId });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to submit score" }, { status: 500 });
  }
}
