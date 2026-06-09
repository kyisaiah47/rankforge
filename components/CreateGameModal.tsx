"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Game { gameId: string; name: string; apiKey: string; }

export default function CreateGameModal({ onCreated }: { onCreated: (g: Game) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<Game | null>(null);
  const [copied, setCopied] = useState(false);

  const submit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    const res = await fetch("/api/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    const game = await res.json();
    setLoading(false);
    setCreated(game);
    onCreated(game);
  };

  const copy = () => {
    navigator.clipboard.writeText(created!.apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setOpen(false);
    setCreated(null);
    setName("");
    setDescription("");
  };

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>+ New Game</Button>
      <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); setOpen(o); }}>
        <DialogContent className="sm:max-w-lg">
          {!created ? (
            <>
              <DialogHeader>
                <DialogTitle>Register a Game</DialogTitle>
                <DialogDescription>
                  Give your game a name to get an API key for submitting scores.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 mt-2">
                <Input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Game name"
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                />
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description (optional)"
                  rows={2}
                  className="resize-none"
                />
              </div>
              <div className="flex gap-2 mt-2">
                <Button onClick={submit} disabled={loading || !name.trim()} className="flex-1">
                  {loading ? "Creating…" : "Create Game"}
                </Button>
                <Button variant="outline" onClick={reset}>Cancel</Button>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Game created! 🎉</DialogTitle>
                <DialogDescription>
                  Copy your API key now — it won&apos;t be shown again.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-2 space-y-4">
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground font-medium">API Key</p>
                  <div className="flex gap-2">
                    <code className="flex-1 bg-muted rounded-lg px-3 py-2 text-xs font-mono text-primary break-all">
                      {created.apiKey}
                    </code>
                    <Button variant="outline" size="sm" onClick={copy} className="shrink-0">
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground font-medium">Usage</p>
                  <pre className="bg-muted rounded-lg px-3 py-2 text-xs font-mono text-foreground overflow-x-auto">
{`curl -X POST /api/scores \\
  -H "Authorization: Bearer ${created.apiKey.slice(0, 20)}..." \\
  -d '{"playerId":"p1","playerName":"Hero","score":9999}'`}
                  </pre>
                </div>
                <Button onClick={reset} className="w-full">Done</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
