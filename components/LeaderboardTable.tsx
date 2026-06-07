"use client";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Entry {
  rank: number;
  playerId: string;
  playerName: string;
  score: number;
  updatedAt: string;
}

const MEDALS = ["🥇", "🥈", "🥉"];

export default function LeaderboardTable({
  gameId,
  initialEntries,
}: {
  gameId: string;
  initialEntries: Entry[];
}) {
  const [entries, setEntries] = useState<Entry[]>(initialEntries);
  const [flash, setFlash] = useState<string | null>(null);
  const prevRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const es = new EventSource(`/api/stream/${gameId}`);
    es.onmessage = (e) => {
      const data = JSON.parse(e.data);
      const next: Entry[] = data.entries;
      for (const entry of next) {
        const prev = prevRef.current[entry.playerId];
        if (prev !== undefined && prev !== entry.score) {
          setFlash(entry.playerId);
          setTimeout(() => setFlash(null), 1200);
        }
      }
      prevRef.current = Object.fromEntries(next.map((e) => [e.playerId, e.score]));
      setEntries(next);
    };
    return () => es.close();
  }, [gameId]);

  if (entries.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-3">🏆</p>
        <p className="font-semibold mb-1">No scores yet</p>
        <p className="text-muted-foreground text-sm">Submit your first score via the API to appear here</p>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Rank</TableHead>
            <TableHead>Player</TableHead>
            <TableHead className="text-right">Score</TableHead>
            <TableHead className="text-right hidden sm:table-cell">Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry, i) => {
            const isTop3 = i < 3;
            const isFirst = i === 0;
            const isFlashing = flash === entry.playerId;

            return (
              <TableRow
                key={entry.playerId}
                className={`transition-colors duration-500 ${
                  isFlashing ? "bg-green-500/10" : ""
                } ${isFirst ? "bg-yellow-500/5" : ""}`}
              >
                <TableCell className="font-medium">
                  {isTop3 ? (
                    <span className="text-lg">{MEDALS[i]}</span>
                  ) : (
                    <span className="text-muted-foreground font-mono text-sm">{entry.rank}</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className={`text-xs font-bold ${isFirst ? "bg-yellow-500/20 text-yellow-400" : "bg-muted text-muted-foreground"}`}>
                        {entry.playerName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className={`text-sm font-medium ${isFirst ? "text-yellow-400" : ""}`}>
                      {entry.playerName}
                    </span>
                    {isFlashing && (
                      <Badge variant="secondary" className="text-green-500 text-xs border-green-500/30 bg-green-500/10">
                        ↑ new best
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className={`font-mono font-semibold ${isFirst ? "text-yellow-400" : "text-green-500"}`}>
                    {entry.score.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell className="text-right hidden sm:table-cell text-muted-foreground text-xs">
                  {new Date(entry.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className="mt-4 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
        <span className="text-xs text-muted-foreground">Live · updates every 5s</span>
      </div>
    </div>
  );
}
