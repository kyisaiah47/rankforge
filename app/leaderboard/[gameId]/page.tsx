import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getGame, getLeaderboard } from "@/lib/dynamodb";
import LeaderboardTable from "@/components/LeaderboardTable";
import PeriodTabs from "@/components/PeriodTabs";

// gameIds are runtime user-generated — opt out of build-time instant-nav validation
export const unstable_instant = false;

type Period = "all" | "daily" | "weekly" | "monthly";
const VALID_PERIODS: Period[] = ["all", "daily", "weekly", "monthly"];

interface PageProps {
  params: Promise<{ gameId: string }>;
  searchParams: Promise<{ period?: string }>;
}

// Cached: game name/description don't change often
async function GameHeader({ gameId }: { gameId: string }) {
  "use cache";
  const game = await getGame(gameId);
  if (!game) return <span className="text-zinc-400">Game not found</span>;
  return (
    <div>
      <h1 className="text-2xl font-bold">{game.name}</h1>
      {game.description && (
        <p className="text-zinc-400 text-sm mt-1">{game.description}</p>
      )}
    </div>
  );
}

// Dynamic: live leaderboard data + notFound guard — must be inside Suspense
async function LeaderboardContent({
  params,
  searchParams,
}: {
  params: Promise<{ gameId: string }>;
  searchParams: Promise<{ period?: string }>;
}) {
  const { gameId } = await params;
  const { period: rawPeriod } = await searchParams;

  const period: Period = VALID_PERIODS.includes(rawPeriod as Period)
    ? (rawPeriod as Period)
    : "all";

  const [game, entries] = await Promise.all([
    getGame(gameId),
    getLeaderboard(gameId, period, 100),
  ]);

  if (!game) notFound();

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <PeriodTabs current={period} />
        <p className="text-xs text-zinc-600 font-mono hidden sm:block">
          {gameId}
        </p>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <LeaderboardTable gameId={gameId} initialEntries={entries} />
      </div>
    </>
  );
}

export default function LeaderboardPage({ params, searchParams }: PageProps) {
  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight">
          RankForge
        </Link>
        <Link
          href="/dashboard"
          className="text-sm text-zinc-400 hover:text-white transition-colors"
        >
          Dashboard
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-start justify-between mb-6">
          <Suspense
            fallback={
              <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse" />
            }
          >
            {params.then(({ gameId }) => (
              <GameHeader gameId={gameId} />
            ))}
          </Suspense>
        </div>

        <Suspense
          fallback={
            <div className="space-y-4">
              <div className="h-9 w-64 bg-zinc-800 rounded-lg animate-pulse" />
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-3">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-10 bg-zinc-800 rounded animate-pulse"
                    style={{ opacity: 1 - i * 0.15 }}
                  />
                ))}
              </div>
            </div>
          }
        >
          <LeaderboardContent params={params} searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
