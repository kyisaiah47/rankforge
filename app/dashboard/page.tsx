"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import CreateGameModal from "@/components/CreateGameModal";

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
    <main className="min-h-screen bg-black text-white">
      <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight">
          RankForge
        </Link>
        <span className="text-sm text-zinc-400">Dashboard</span>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Your Games</h1>
            <p className="text-zinc-400 text-sm mt-1">
              Register a game to get an API key and start submitting scores.
            </p>
          </div>
          <CreateGameModal onCreated={() => load()} />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 animate-pulse h-28"
              />
            ))}
          </div>
        ) : games.length === 0 ? (
          <div className="text-center py-24 text-zinc-500">
            <p className="text-4xl mb-4">🎮</p>
            <p className="font-medium">No games yet</p>
            <p className="text-sm mt-1">Create one to get your first API key</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {games.map((game) => (
              <Link
                key={game.gameId}
                href={`/leaderboard/${game.gameId}`}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-600 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-semibold group-hover:text-white transition-colors">
                      {game.name}
                    </h2>
                    {game.description && (
                      <p className="text-zinc-400 text-sm mt-1 line-clamp-2">
                        {game.description}
                      </p>
                    )}
                  </div>
                  <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors text-sm mt-0.5">
                    →
                  </span>
                </div>
                <p className="text-xs text-zinc-600 mt-4 font-mono">
                  {game.gameId}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
