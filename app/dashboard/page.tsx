"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import CreateGameModal from "@/components/CreateGameModal";
import { LogoFull } from "@/components/Logo";

interface Game {
  gameId: string;
  name: string;
  description: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/games");
    const data = await res.json();
    setGames(data.games ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoFull />
            <span className="text-white/20">/</span>
            <span className="text-sm text-muted-foreground">Dashboard</span>
          </div>
          <CreateGameModal onCreated={() => load()} />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Your Games</h1>
          <p className="text-muted-foreground text-sm">
            Register a game to get an API key and start submitting scores.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-1" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-3 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : games.length === 0 ? (
          <Card className="text-center py-20">
            <CardContent>
              <p className="text-4xl mb-4">🎮</p>
              <p className="font-semibold text-foreground mb-1">No games yet</p>
              <p className="text-muted-foreground text-sm mb-6">Create one to get your first API key</p>
              <CreateGameModal onCreated={() => load()} />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map((game) => (
              <Link key={game.gameId} href={`/leaderboard/${game.gameId}`}>
                <Card className="hover:border-primary/30 transition-colors cursor-pointer h-full group">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base group-hover:text-foreground transition-colors">
                        {game.name}
                      </CardTitle>
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors text-sm shrink-0">→</span>
                    </div>
                    {game.description && (
                      <CardDescription className="line-clamp-2 text-xs">{game.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary" className="font-mono text-xs">{game.gameId}</Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
