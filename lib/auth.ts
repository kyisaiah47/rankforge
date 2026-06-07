import { getGameByApiKey } from "./dynamodb";
import type { Game } from "./dynamodb";

export async function validateApiKey(
  request: Request
): Promise<Game | null> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const apiKey = authHeader.slice(7).trim();
  return getGameByApiKey(apiKey);
}
