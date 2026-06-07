import { NextResponse } from "next/server";
import { getLeaderboard, getGame } from "@/lib/dynamodb";

type Period = "all" | "daily" | "weekly" | "monthly";
const VALID_PERIODS: Period[] = ["all", "daily", "weekly", "monthly"];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;
  const { searchParams } = new URL(request.url);
  const period = (searchParams.get("period") ?? "all") as Period;
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "100"), 500);

  if (!VALID_PERIODS.includes(period)) {
    return NextResponse.json(
      { error: "period must be one of: all, daily, weekly, monthly" },
      { status: 400 }
    );
  }

  const game = await getGame(gameId);
  if (!game) return NextResponse.json({ error: "Game not found" }, { status: 404 });

  const entries = await getLeaderboard(gameId, period, limit);
  return NextResponse.json({
    gameId,
    gameName: game.name,
    period,
    entries,
    generatedAt: new Date().toISOString(),
  });
}
