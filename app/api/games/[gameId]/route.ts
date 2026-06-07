import { NextResponse } from "next/server";
import { getGame } from "@/lib/dynamodb";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;
  const game = await getGame(gameId);
  if (!game) return NextResponse.json({ error: "Not found" }, { status: 404 });
  // Omit apiKey from public response
  const { apiKey: _omit, ...public_game } = game;
  return NextResponse.json(public_game);
}
