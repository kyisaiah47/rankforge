"use client";
import { useEffect, useRef, useState } from "react";

interface Entry {
  rank: number;
  playerId: string;
  playerName: string;
  score: number;
  updatedAt: string;
}

interface Props {
  gameId: string;
  initialEntries: Entry[];
}

const MEDALS = ["🥇", "🥈", "🥉"];

export default function LeaderboardTable({ gameId, initialEntries }: Props) {
  const [entries, setEntries] = useState<Entry[]>(initialEntries);
  const [flash, setFlash] = useState<string | null>(null);
  const prevScoresRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const es = new EventSource(`/api/stream/${gameId}`);
    es.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const newEntries: Entry[] = data.entries;

      // detect score change to flash the updated row
      for (const entry of newEntries) {
        const prev = prevScoresRef.current[entry.playerId];
        if (prev !== undefined && prev !== entry.score) {
          setFlash(entry.playerId);
          setTimeout(() => setFlash(null), 1000);
        }
      }

      prevScoresRef.current = Object.fromEntries(
        newEntries.map((e) => [e.playerId, e.score])
      );
      setEntries(newEntries);
    };
    return () => es.close();
  }, [gameId]);

  if (entries.length === 0) {
    return (
      <div className="text-center py-16 text-zinc-500">
        <p className="text-4xl mb-3">🏆</p>
        <p className="font-medium text-zinc-400">No scores yet</p>
        <p className="text-sm mt-1">Submit your first score via the API to appear here</p>
      </div>
    );
  }

  return (
    <div>
      <table className="w-full">
        <thead>
          <tr className="text-left text-xs text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
            <th className="pb-3 w-12">Rank</th>
            <th className="pb-3">Player</th>
            <th className="pb-3 text-right">Score</th>
            <th className="pb-3 text-right hidden sm:table-cell w-32">Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/60">
          {entries.map((entry, i) => {
            const isTop3 = i < 3;
            const isFirst = i === 0;
            const isFlashing = flash === entry.playerId;

            return (
              <tr
                key={entry.playerId}
                className={`transition-all duration-500 ${
                  isFlashing ? "bg-green-500/10" : ""
                } ${isFirst ? "bg-yellow-500/5" : ""}`}
              >
                <td className="py-3.5 pr-4">
                  {isTop3 ? (
                    <span className="text-xl">{MEDALS[i]}</span>
                  ) : (
                    <span className="text-zinc-600 text-sm font-mono w-6 inline-block text-center">
                      {entry.rank}
                    </span>
                  )}
                </td>
                <td className="py-3.5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isFirst
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {entry.playerName[0].toUpperCase()}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        isFirst ? "text-yellow-400" : "text-zinc-100"
                      }`}
                    >
                      {entry.playerName}
                    </span>
                    {isFlashing && (
                      <span className="text-xs text-green-400 font-medium animate-fade-in-up">
                        ↑ new best
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3.5 text-right">
                  <span
                    className={`font-mono font-semibold ${
                      isFirst ? "text-yellow-400 text-base" : "text-green-400 text-sm"
                    }`}
                  >
                    {entry.score.toLocaleString()}
                  </span>
                </td>
                <td className="py-3.5 text-right hidden sm:table-cell">
                  <span className="text-xs text-zinc-600">
                    {new Date(entry.updatedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 live-dot inline-block" />
        <span className="text-xs text-zinc-600">Live · updates every 5s</span>
      </div>
    </div>
  );
}
