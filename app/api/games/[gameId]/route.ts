import { NextResponse } from "next/server";
import { getGame, db, TABLE } from "@/lib/dynamodb";
import { UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;
  const game = await getGame(gameId);
  if (!game) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { apiKey: _omit, ...public_game } = game;
  return NextResponse.json(public_game);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;
  const body = await request.json();
  const { name, description } = body;
  if (!name?.trim()) return NextResponse.json({ error: "name is required" }, { status: 400 });

  await db.send(new UpdateCommand({
    TableName: TABLE,
    Key: { PK: `GAME#${gameId}`, SK: "#META" },
    UpdateExpression: "SET #n = :name, description = :desc",
    ExpressionAttributeNames: { "#n": "name" },
    ExpressionAttributeValues: { ":name": name.trim(), ":desc": description?.trim() ?? "" },
    ConditionExpression: "attribute_exists(PK)",
  }));
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;
  await db.send(new DeleteCommand({
    TableName: TABLE,
    Key: { PK: `GAME#${gameId}`, SK: "#META" },
  }));
  return NextResponse.json({ ok: true });
}
