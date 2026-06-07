import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getGame, getLeaderboard } from "@/lib/dynamodb";
import LeaderboardTable from "@/components/LeaderboardTable";
import PeriodTabs from "@/components/PeriodTabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LogoFull } from "@/components/Logo";

export const unstable_instant = false;

type Period = "all" | "daily" | "weekly" | "monthly";
const VALID_PERIODS: Period[] = ["all", "daily", "weekly", "monthly"];

interface PageProps {
  params: Promise<{ gameId: string }>;
  searchParams: Promise<{ period?: string }>;
}

async function GameHeader({ gameId }: { gameId: string }) {
  "use cache";
  const game = await getGame(gameId);
  if (!game) return null;
  return (
    <div>
      <h1 className="text-2xl font-bold">{game.name}</h1>
      {game.description && (
        <p className="text-muted-foreground text-sm mt-1">{game.description}</p>
      )}
    </div>
  );
}

async function LeaderboardContent({
  params,
  searchParams,
}: {
  params: Promise<{ gameId: string }>;
  searchParams: Promise<{ period?: string }>;
}) {
  const { gameId } = await params;
  const { period: rawPeriod } = await searchParams;
  const period: Period = VALID_PERIODS.includes(rawPeriod as Period) ? (rawPeriod as Period) : "all";

  const [game, entries] = await Promise.all([
    getGame(gameId),
    getLeaderboard(gameId, period, 100),
  ]);
  if (!game) notFound();

  return (
    <>
      <div className="mb-6">
        <PeriodTabs current={period} />
      </div>
      <Card className="shadow-xl shadow-black/40">
        <CardContent className="pt-6">
          <LeaderboardTable gameId={gameId} initialEntries={entries} />
        </CardContent>
      </Card>
    </>
  );
}

export default function LeaderboardPage({ params, searchParams }: PageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/90 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoFull />
            <span className="text-border">/</span>
            <span className="text-sm text-muted-foreground">Leaderboard</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1 border-primary/40 text-primary hidden sm:flex">
              <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block animate-pulse" />
              Live
            </Badge>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between mb-8">
          <Suspense fallback={
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          }>
            {params.then(({ gameId }) => <GameHeader gameId={gameId} />)}
          </Suspense>
        </div>

        <Suspense fallback={
          <div className="space-y-4">
            <Skeleton className="h-10 w-80" />
            <Card>
              <CardHeader>
                <div className="space-y-2">
                  {[0,1,2,3,4].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" style={{ opacity: 1 - i * 0.15 }} />
                  ))}
                </div>
              </CardHeader>
            </Card>
          </div>
        }>
          <LeaderboardContent params={params} searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  );
}
