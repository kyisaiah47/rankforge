import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LogoFull, LogoMark } from "@/components/Logo";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <LogoFull />
          <nav className="flex items-center gap-6">
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">How it works</a>
            <a href="#api" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">API</a>
            <Button asChild size="sm">
              <Link href="/dashboard">Dashboard →</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative max-w-5xl mx-auto px-6 pt-24 pb-20 text-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 flex items-start justify-center">
          <div className="w-[700px] h-[400px] rounded-full bg-primary/10 blur-[120px] -translate-y-1/4" />
        </div>
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: `linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)`, backgroundSize: "48px 48px" }}
        />

        <div className="relative z-10">
          <Badge variant="outline" className="mb-8 gap-2 border-border bg-transparent text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block animate-pulse" />
            Powered by AWS DynamoDB + Vercel
          </Badge>

          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6 leading-[1.05] font-heading">
            Leaderboards that
            <br />
            <span className="text-primary">scale to millions</span>
          </h1>

          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Drop a leaderboard into any game in minutes. One API call to submit
            scores. All-time, daily, weekly, and monthly rankings — auto-managed,
            real-time, and production-ready from day one.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-20">
            <Button asChild size="lg">
              <Link href="/dashboard">Get your API key →</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#api">View API docs</a>
            </Button>
          </div>

          {/* Live preview card */}
          <Card className="max-w-sm mx-auto text-left shadow-2xl shadow-black/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Space Raiders — All Time</CardTitle>
                <Badge variant="secondary" className="gap-1.5 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block" />
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {[
                { rank: 1, name: "xX_NovaStar_Xx", score: "2,847,500", medal: "🥇" },
                { rank: 2, name: "VoidPilot",       score: "2,341,200", medal: "🥈" },
                { rank: 3, name: "CometChaser",     score: "1,998,750", medal: "🥉" },
                { rank: 4, name: "AstroGhost",      score: "1,754,300", medal: null },
                { rank: 5, name: "NebulaKnight",    score: "1,502,100", medal: null },
              ].map((e) => (
                <div key={e.rank} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="w-5 text-center text-sm">
                      {e.medal ?? <span className="text-muted-foreground font-mono text-xs">{e.rank}</span>}
                    </span>
                    <span className={`text-sm ${e.rank === 1 ? "text-primary font-semibold" : "text-foreground"}`}>
                      {e.name}
                    </span>
                  </div>
                  <span className="font-mono text-sm text-primary font-semibold">{e.score}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-muted/30 py-10">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-6 text-center">
          {[
            { value: "<5ms", label: "Leaderboard read latency" },
            { value: "∞",    label: "Concurrent score writes" },
            { value: "4×",   label: "Time windows per game" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl sm:text-4xl font-bold text-primary mb-1 font-heading">{s.value}</p>
              <p className="text-muted-foreground text-xs sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-6 py-24">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 font-heading">Ship in 3 steps</h2>
        <p className="text-muted-foreground text-center mb-14 text-sm">No infrastructure to manage. No ops overhead.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { step: "01", title: "Register your game",    body: "Create a game in the dashboard and get a unique API key in seconds.", icon: "🎮" },
            { step: "02", title: "Submit scores",          body: "One POST request from your game client or backend. We handle deduplication and high-score gating.", icon: "📡" },
            { step: "03", title: "Display live rankings",  body: "Embed the leaderboard URL or query the API. Scores stream live via Server-Sent Events.", icon: "📊" },
          ].map((f) => (
            <Card key={f.step} className="relative overflow-hidden hover:border-primary/30 transition-colors">
              <span className="absolute top-4 right-5 text-muted/20 text-6xl font-black select-none font-heading">{f.step}</span>
              <CardContent className="pt-7">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { icon: "⚡", title: "Real-time via SSE",   body: "Score updates pushed to every connected browser instantly — no polling, no WebSocket servers." },
          { icon: "📅", title: "4 time windows",      body: "All-time, daily, weekly, and monthly boards tracked automatically with TTL-based cleanup." },
          { icon: "🔒", title: "API key auth",        body: "Every game gets a unique key. Clients can read; only your server can write." },
          { icon: "🏆", title: "High-score gating",   body: "Conditional DynamoDB writes reject submissions that don't beat the player's personal best." },
          { icon: "📐", title: "Single-table design", body: "One DynamoDB table, two GSIs. Score-sorted index enables O(1) rank queries without scanning." },
          { icon: "🌍", title: "Built for scale",     body: "DynamoDB on-demand mode. Handles massive traffic spikes with zero capacity planning." },
        ].map((f) => (
          <Card key={f.title} className="flex gap-4 p-5 hover:border-primary/30 transition-colors">
            <span className="text-2xl shrink-0 mt-0.5">{f.icon}</span>
            <div>
              <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.body}</p>
            </div>
          </Card>
        ))}
      </section>

      <Separator />

      {/* API Docs */}
      <section id="api" className="max-w-4xl mx-auto px-6 py-24">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 font-heading">API Reference</h2>
        <p className="text-muted-foreground mb-10 text-sm">
          Base URL: <code className="font-mono text-foreground bg-muted border border-border px-1.5 py-0.5 rounded text-xs">https://rankforge-chi.vercel.app</code>
        </p>
        <div className="space-y-4">
          <ApiBlock method="POST" path="/api/scores" auth
            description="Submit a score. Only recorded if it beats the player's personal best for each time window."
            body={`{\n  "playerId": "user_abc123",\n  "playerName": "AlphaWolf",\n  "score": 98750\n}`}
            response={`{ "ok": true, "gameId": "1d5ab1dfabc7" }`}
          />
          <ApiBlock method="GET" path="/api/leaderboard/{gameId}?period=all"
            description="Get top 100 entries. period: all | daily | weekly | monthly"
            response={`{\n  "gameId": "...",\n  "period": "all",\n  "entries": [\n    { "rank": 1, "playerName": "AlphaWolf", "score": 98750 }\n  ]\n}`}
          />
          <ApiBlock method="GET" path="/api/leaderboard/{gameId}/rank/{playerId}"
            description="Get a specific player's rank, score, and total player count."
            response={`{ "rank": 3, "score": 74100, "total": 8 }`}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-border py-24 text-center px-6 bg-muted/20">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[500px] h-[200px] rounded-full bg-primary/10 blur-[80px]" />
        </div>
        <div className="relative z-10">
          <LogoMark size={40} className="mx-auto mb-5 opacity-60" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-heading">Ready to ship?</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm">Create a game, get your API key, and have a live leaderboard in under 5 minutes.</p>
          <Button asChild size="lg">
            <Link href="/dashboard">Get started free →</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
        <LogoFull className="opacity-50 hover:opacity-100 transition-opacity" />
        <span className="text-muted-foreground text-xs">Track 3 · H0 Hackathon 2026</span>
      </footer>
    </div>
  );
}

function ApiBlock({ method, path, description, auth, body, response }: {
  method: string; path: string; description: string;
  auth?: boolean; body?: string; response: string;
}) {
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant={method === "POST" ? "default" : "secondary"} className="font-mono text-xs">{method}</Badge>
          <code className="font-mono text-sm text-foreground">{path}</code>
          {auth && <Badge variant="outline" className="ml-auto text-xs">Bearer token required</Badge>}
        </div>
        <p className="text-muted-foreground text-sm mb-3">{description}</p>
        {body && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground mb-1.5 font-medium uppercase tracking-wide">Request body</p>
            <pre className="bg-muted border border-border rounded-lg p-3 text-xs text-foreground overflow-x-auto leading-relaxed">{body}</pre>
          </div>
        )}
        <p className="text-xs text-muted-foreground mb-1.5 font-medium uppercase tracking-wide">Response</p>
        <pre className="bg-muted border border-border rounded-lg p-3 text-xs text-primary overflow-x-auto leading-relaxed">{response}</pre>
      </CardContent>
    </Card>
  );
}
