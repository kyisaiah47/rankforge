import { getLeaderboard } from "@/lib/dynamodb";

// Server-Sent Events — pushes leaderboard every 5 seconds
// dynamic by default in Next.js 16 with cacheComponents
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;

  const encoder = new TextEncoder();
  let intervalId: ReturnType<typeof setInterval>;
  let closed = false;

  const stream = new ReadableStream({
    start(controller) {
      const send = async () => {
        if (closed) return;
        try {
          const entries = await getLeaderboard(gameId, "all", 100);
          const data = JSON.stringify({ entries, ts: Date.now() });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        } catch {
          // swallow — client will retry on reconnect
        }
      };

      send();
      intervalId = setInterval(send, 5000);
    },
    cancel() {
      closed = true;
      clearInterval(intervalId);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
