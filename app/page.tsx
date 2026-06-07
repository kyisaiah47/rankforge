import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="border-b border-zinc-800/60 px-6 py-4 flex items-center justify-between backdrop-blur-sm sticky top-0 z-10 bg-black/80">
        <div className="flex items-center gap-2">
          <span className="text-green-400 font-bold text-xl">⬡</span>
          <span className="font-bold text-lg tracking-tight">RankForge</span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <a href="#how-it-works" className="text-zinc-400 hover:text-white transition-colors hidden sm:block">How it works</a>
          <a href="#api" className="text-zinc-400 hover:text-white transition-colors hidden sm:block">API</a>
          <Link
            href="/dashboard"
            className="bg-white text-black font-semibold px-4 py-1.5 rounded-lg hover:bg-zinc-200 transition-colors text-sm"
          >
            Dashboard →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-green-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 text-xs text-zinc-400 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 live-dot inline-block" />
          Powered by AWS DynamoDB + Vercel — built for scale
        </div>

        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
          Leaderboards that
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-green-600">
            scale to millions
          </span>
        </h1>
        <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Drop a leaderboard into any game in minutes. One API call to submit scores.
          All-time, daily, weekly, and monthly rankings — auto-managed, real-time, and
          production-ready from day one.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
          <Link
            href="/dashboard"
            className="bg-white text-black font-semibold px-8 py-3 rounded-lg hover:bg-zinc-100 transition-colors text-base"
          >
            Get your API key →
          </Link>
          <a
            href="#api"
            className="border border-zinc-700 text-zinc-300 px-8 py-3 rounded-lg hover:border-zinc-500 hover:text-white transition-colors text-base"
          >
            View API docs
          </a>
        </div>

        {/* Live leaderboard preview */}
        <div className="max-w-md mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-left shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-zinc-300">Space Raiders — All Time</span>
            <span className="flex items-center gap-1.5 text-xs text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 live-dot inline-block" />
              Live
            </span>
          </div>
          {[
            { rank: 1, name: "AlphaWolf", score: "98,750", medal: "🥇" },
            { rank: 2, name: "NeonByte", score: "87,300", medal: "🥈" },
            { rank: 3, name: "VoidRunner", score: "74,100", medal: "🥉" },
            { rank: 4, name: "ShadowFox", score: "65,400", medal: null },
            { rank: 5, name: "CyberAce", score: "52,800", medal: null },
          ].map((entry) => (
            <div
              key={entry.rank}
              className="flex items-center justify-between py-2.5 border-b border-zinc-800/60 last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 text-center text-sm">
                  {entry.medal ?? <span className="text-zinc-600 text-xs">{entry.rank}</span>}
                </span>
                <span className={`text-sm ${entry.rank === 1 ? "text-yellow-400 font-semibold" : "text-zinc-200"}`}>
                  {entry.name}
                </span>
              </div>
              <span className="font-mono text-green-400 text-sm">{entry.score}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-zinc-800/60 py-10">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-6 text-center">
          {[
            { value: "<5ms", label: "Leaderboard read latency" },
            { value: "∞", label: "Concurrent score writes" },
            { value: "4×", label: "Time windows per game" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl sm:text-4xl font-bold text-green-400 mb-1">{s.value}</p>
              <p className="text-zinc-500 text-xs sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">Ship in 3 steps</h2>
        <p className="text-zinc-500 text-center mb-12">No infrastructure to manage. No ops overhead.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Register your game",
              body: "Create a game in the dashboard and get a unique API key in seconds.",
              icon: "🎮",
            },
            {
              step: "02",
              title: "Submit scores",
              body: "One POST request from your game client or backend. We handle deduplication and high-score gating.",
              icon: "📡",
            },
            {
              step: "03",
              title: "Display live rankings",
              body: "Embed the leaderboard URL or query the API. Scores stream live via Server-Sent Events.",
              icon: "📊",
            },
          ].map((f) => (
            <div
              key={f.step}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group hover:border-zinc-600 transition-colors"
            >
              <span className="absolute top-4 right-5 text-zinc-800 text-5xl font-black select-none group-hover:text-zinc-700 transition-colors">
                {f.step}
              </span>
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-base mb-2">{f.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-20 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { icon: "⚡", title: "Real-time via SSE", body: "Score updates pushed to every connected browser instantly — no polling, no WebSocket servers to manage." },
          { icon: "📅", title: "4 time windows", body: "All-time, daily, weekly, and monthly boards tracked automatically. TTL-based cleanup means zero maintenance." },
          { icon: "🔒", title: "API key auth", body: "Every game gets a unique key. Score submissions are gated — clients can read, only your server can write." },
          { icon: "🏆", title: "High-score gating", body: "Conditional DynamoDB writes reject submissions that don't beat the player's existing personal best." },
          { icon: "📐", title: "Single-table design", body: "One DynamoDB table, two GSIs. Score-sorted index enables O(1) rank queries without scanning." },
          { icon: "🌍", title: "Built for scale", body: "DynamoDB on-demand mode — zero capacity planning. Handles Black Friday traffic spikes without config changes." },
        ].map((f) => (
          <div key={f.title} className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-5 flex gap-4">
            <span className="text-2xl mt-0.5 shrink-0">{f.icon}</span>
            <div>
              <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{f.body}</p>
            </div>
          </div>
        ))}
      </section>

      {/* API Docs */}
      <section id="api" className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">API Reference</h2>
        <p className="text-zinc-500 mb-10">Base URL: <code className="text-zinc-300 font-mono text-sm">https://rankforge-chi.vercel.app</code></p>
        <div className="space-y-5">
          <ApiBlock
            method="POST"
            path="/api/scores"
            description="Submit a score for a player. Only recorded if it beats their existing personal best for each time window."
            auth
            body={`{
  "playerId": "user_abc123",
  "playerName": "AlphaWolf",
  "score": 98750
}`}
            response={`{ "ok": true, "gameId": "1d5ab1dfabc7" }`}
          />
          <ApiBlock
            method="GET"
            path="/api/leaderboard/{gameId}?period=all"
            description="Get top 100 entries for a game. period: all | daily | weekly | monthly"
            response={`{
  "gameId": "1d5ab1dfabc7",
  "period": "all",
  "entries": [
    { "rank": 1, "playerName": "AlphaWolf", "score": 98750 },
    { "rank": 2, "playerName": "NeonByte",  "score": 87300 }
  ]
}`}
          />
          <ApiBlock
            method="GET"
            path="/api/leaderboard/{gameId}/rank/{playerId}"
            description="Get a specific player's rank, score, and total player count."
            response={`{ "rank": 3, "score": 74100, "total": 8 }`}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-800/60 py-20 text-center px-6">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to ship?</h2>
        <p className="text-zinc-400 mb-8 max-w-md mx-auto">Create a game, get your API key, and have a live leaderboard in under 5 minutes.</p>
        <Link
          href="/dashboard"
          className="inline-block bg-white text-black font-semibold px-10 py-3.5 rounded-lg hover:bg-zinc-100 transition-colors text-base"
        >
          Get started free →
        </Link>
      </section>

      <footer className="border-t border-zinc-800/60 px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-zinc-600 text-xs">
        <span>RankForge · Built on AWS DynamoDB + Vercel</span>
        <span>Track 3 · H0 Hackathon 2026</span>
      </footer>
    </main>
  );
}

function ApiBlock({
  method, path, description, auth, body, response,
}: {
  method: string; path: string; description: string;
  auth?: boolean; body?: string; response: string;
}) {
  const methodColor = method === "POST" ? "text-green-400" : "text-blue-400";
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <span className={`font-mono font-bold text-sm ${methodColor}`}>{method}</span>
        <span className="font-mono text-sm text-white">{path}</span>
        {auth && (
          <span className="ml-auto text-xs bg-yellow-900/40 text-yellow-400 border border-yellow-800/60 rounded px-2 py-0.5">
            Bearer token required
          </span>
        )}
      </div>
      <p className="text-zinc-400 text-sm mb-3">{description}</p>
      {body && (
        <div className="mb-3">
          <p className="text-xs text-zinc-500 mb-1.5 font-medium">Request body</p>
          <pre className="bg-black rounded-lg p-3 text-xs text-zinc-300 overflow-x-auto leading-relaxed">{body}</pre>
        </div>
      )}
      <div>
        <p className="text-xs text-zinc-500 mb-1.5 font-medium">Response</p>
        <pre className="bg-black rounded-lg p-3 text-xs text-green-400 overflow-x-auto leading-relaxed">{response}</pre>
      </div>
    </div>
  );
}
