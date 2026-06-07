"use client";
import { useState } from "react";

interface Game {
  gameId: string;
  name: string;
  apiKey: string;
}

interface Props {
  onCreated: (game: Game) => void;
}

export default function CreateGameModal({ onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<Game | null>(null);

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

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="bg-white text-black font-semibold px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors text-sm"
      >
        + New Game
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md">
        {!created ? (
          <>
            <h2 className="text-lg font-bold mb-4">Register a Game</h2>
            <div className="space-y-3">
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Game name"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                rows={2}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white resize-none"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={submit}
                disabled={loading || !name.trim()}
                className="bg-white text-black font-semibold px-4 py-2 rounded-lg text-sm disabled:opacity-50 hover:bg-zinc-200 transition-colors"
              >
                {loading ? "Creating…" : "Create"}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="text-zinc-400 hover:text-white px-4 py-2 text-sm"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-bold mb-2">Game created!</h2>
            <p className="text-zinc-400 text-sm mb-4">
              Save your API key — it&apos;s shown only once.
            </p>
            <div className="bg-zinc-800 rounded-lg p-3 font-mono text-xs text-green-400 break-all mb-4">
              {created.apiKey}
            </div>
            <p className="text-xs text-zinc-500 mb-4">
              Use this key in the{" "}
              <code className="text-zinc-300">Authorization: Bearer &lt;key&gt;</code> header
              when submitting scores.
            </p>
            <button
              onClick={() => {
                setOpen(false);
                setCreated(null);
                setName("");
                setDescription("");
              }}
              className="bg-white text-black font-semibold px-4 py-2 rounded-lg text-sm hover:bg-zinc-200 transition-colors"
            >
              Done
            </button>
          </>
        )}
      </div>
    </div>
  );
}
