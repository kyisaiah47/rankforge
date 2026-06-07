import { LogoFull } from "@/components/Logo";

export const metadata = { title: "RankForge — Architecture" };

// SVG must use literal colors — we pick from the theme palette
// primary: oklch(0.8719 0.1829 125.59) ≈ #aced3a (lime)
// We use CSS currentColor trick via a wrapper + named vars
const C = {
  bg:      "#09090b",
  lane:    "#111113",
  border:  "#27272a",
  node:    "#1c1c1f",
  nodeBdr: "#3f3f46",
  text:    "#e4e4e7",
  muted:   "#71717a",
  dim:     "#52525b",
  primary: "#aced3a",
  purple:  "#a78bfa",
  amber:   "#f59e0b",
};

export default function ArchitecturePage() {
  return (
    <main className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <LogoFull className="mb-4" />
          <h1 className="text-2xl font-bold mb-1">Architecture Diagram</h1>
          <p className="text-muted-foreground text-sm">H0 Hackathon · Track 3 · Million-scale Global App</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 overflow-x-auto">
          <svg viewBox="0 0 900 520" className="w-full max-w-4xl mx-auto" style={{ fontFamily: "monospace" }}>
            <rect x="10" y="10" width="870" height="500" rx="12" fill={C.bg} stroke={C.border} strokeWidth="1" />

            {[
              { x: 30,  w: 180, label: "CLIENT",           cx: 120 },
              { x: 230, w: 200, label: "VERCEL EDGE / CDN", cx: 330 },
              { x: 450, w: 200, label: "VERCEL FUNCTIONS",  cx: 550 },
              { x: 670, w: 200, label: "AWS (us-east-1)",   cx: 770 },
            ].map((lane) => (
              <g key={lane.label}>
                <rect x={lane.x} y="30" width={lane.w} height="460" rx="8" fill={C.lane} stroke={C.nodeBdr} strokeWidth="1" strokeDasharray="4 3" />
                <text x={lane.cx} y="52" textAnchor="middle" fill={C.muted} fontSize="11" fontWeight="bold" letterSpacing="1">{lane.label}</text>
              </g>
            ))}

            {/* Browser */}
            <rect x="45" y="70" width="150" height="50" rx="8" fill={C.node} stroke={C.nodeBdr} strokeWidth="1.5" />
            <text x="120" y="91" textAnchor="middle" fill={C.text} fontSize="12" fontWeight="bold">🌐 Browser</text>
            <text x="120" y="108" textAnchor="middle" fill={C.muted} fontSize="10">Game + Leaderboard UI</text>

            {/* Game Client */}
            <rect x="45" y="170" width="150" height="50" rx="8" fill={C.node} stroke={C.nodeBdr} strokeWidth="1.5" />
            <text x="120" y="191" textAnchor="middle" fill={C.text} fontSize="12" fontWeight="bold">🎮 Game Client</text>
            <text x="120" y="208" textAnchor="middle" fill={C.muted} fontSize="10">Score submission</text>

            {/* Static Shell */}
            <rect x="245" y="70" width="170" height="50" rx="8" fill={C.node} stroke={C.primary} strokeWidth="1.5" />
            <text x="330" y="91" textAnchor="middle" fill={C.primary} fontSize="12" fontWeight="bold">⚡ Static Shell</text>
            <text x="330" y="108" textAnchor="middle" fill={C.muted} fontSize="10">PPR · served from edge</text>

            {/* SSE Stream */}
            <rect x="245" y="200" width="170" height="50" rx="8" fill={C.node} stroke={C.purple} strokeWidth="1.5" />
            <text x="330" y="221" textAnchor="middle" fill={C.purple} fontSize="12" fontWeight="bold">📡 SSE Stream</text>
            <text x="330" y="238" textAnchor="middle" fill={C.muted} fontSize="10">/api/stream/[gameId]</text>

            {/* API Routes */}
            <rect x="465" y="70" width="170" height="180" rx="8" fill={C.node} stroke={C.nodeBdr} strokeWidth="1.5" />
            <text x="550" y="93" textAnchor="middle" fill={C.text} fontSize="12" fontWeight="bold">API Routes</text>
            <line x1="465" y1="105" x2="635" y2="105" stroke={C.border} strokeWidth="1" />
            {["POST /api/scores","GET  /api/leaderboard","GET  /api/leaderboard/rank","POST /api/games","GET  /api/games"].map((t, i) => (
              <text key={t} x="478" y={124 + i * 18} fill={C.muted} fontSize="10">{t}</text>
            ))}
            <text x="478" y="214" fill={C.primary} fontSize="10">SSE  /api/stream</text>
            <text x="478" y="232" fill={C.muted} fontSize="10" fontStyle="italic">5s push interval</text>

            {/* DynamoDB */}
            <rect x="685" y="70" width="170" height="120" rx="8" fill={C.node} stroke={C.amber} strokeWidth="2" />
            <text x="770" y="95" textAnchor="middle" fill={C.amber} fontSize="13" fontWeight="bold">DynamoDB</text>
            <text x="770" y="113" textAnchor="middle" fill={C.muted} fontSize="10">Single table · On-demand</text>
            <line x1="685" y1="125" x2="855" y2="125" stroke={C.border} strokeWidth="1" />
            <text x="698" y="143" fill={C.muted} fontSize="10">PK / SK  →  main table</text>
            <text x="698" y="161" fill={C.muted} fontSize="10">GSI1  →  score-sorted</text>
            <text x="698" y="179" fill={C.purple} fontSize="10">apiKey-index  →  auth</text>

            {/* TTL */}
            <rect x="685" y="210" width="170" height="50" rx="8" fill={C.node} stroke={C.nodeBdr} strokeWidth="1.5" />
            <text x="770" y="231" textAnchor="middle" fill={C.text} fontSize="11" fontWeight="bold">TTL auto-expiry</text>
            <text x="770" y="248" textAnchor="middle" fill={C.muted} fontSize="10">daily · weekly · monthly</text>

            {/* Data model table */}
            <rect x="465" y="295" width="390" height="175" rx="8" fill={C.bg} stroke={C.border} strokeWidth="1" />
            <text x="480" y="316" fill={C.muted} fontSize="10" fontWeight="bold" letterSpacing="0.5">DYNAMODB SINGLE-TABLE DESIGN</text>
            <line x1="465" y1="323" x2="855" y2="323" stroke={C.border} strokeWidth="1" />
            {["PK","SK","GSI1PK","GSI1SK"].map((h, i) => (
              <text key={h} x={480 + i * 100} y="340" fill={C.dim} fontSize="9">{h}</text>
            ))}
            <rect x="465" y="345" width="390" height="20" fill={C.node} />
            {["GAME#abc","#META","—","—"].map((v, i) => (
              <text key={v+i} x={480 + i * 100} y="359" fill={i < 2 ? C.primary : C.dim} fontSize="9">{v}</text>
            ))}
            {["GAME#abc","PLAYER#p1","LEADERBOARD#abc#ALL","98750"].map((v, i) => (
              <text key={v+i} x={480 + i * 100} y="379" fill={i < 2 ? C.text : C.purple} fontSize="9">{v}</text>
            ))}
            <rect x="465" y="385" width="390" height="20" fill={C.node} />
            {["GAME#abc#DAILY#…","PLAYER#p1","LEADERBOARD#…#DAILY","98750"].map((v, i) => (
              <text key={v+i} x={480 + i * 100} y="399" fill={i < 2 ? C.text : C.purple} fontSize="9">{v}</text>
            ))}
            {["GAME#abc#WEEKLY#…","PLAYER#p1","LEADERBOARD#…#WEEKLY","98750 + TTL"].map((v, i) => (
              <text key={v+i} x={480 + i * 100} y="419" fill={C.muted} fontSize="9">{v}</text>
            ))}
            <text x="480" y="452" fill={C.dim} fontSize="9" fontStyle="italic">Query GSI1 with ScanIndexForward=false → top-N leaderboard in one request</text>

            {/* Arrows */}
            <defs>
              {[["arr-primary", C.primary], ["arr-purple", C.purple], ["arr-amber", C.amber], ["arr-gray", C.dim]].map(([id, color]) => (
                <marker key={id} id={id} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L6,3 z" fill={color} />
                </marker>
              ))}
            </defs>
            <line x1="195" y1="90" x2="245" y2="95" stroke={C.primary} strokeWidth="1.5" markerEnd="url(#arr-primary)" />
            <text x="218" y="85" textAnchor="middle" fill={C.primary} fontSize="8">GET page</text>
            <line x1="195" y1="215" x2="245" y2="220" stroke={C.purple} strokeWidth="1.5" markerEnd="url(#arr-purple)" strokeDasharray="4 3" />
            <text x="218" y="210" textAnchor="middle" fill={C.purple} fontSize="8">EventSource</text>
            <line x1="195" y1="195" x2="465" y2="150" stroke={C.dim} strokeWidth="1.5" markerEnd="url(#arr-gray)" />
            <text x="330" y="162" textAnchor="middle" fill={C.dim} fontSize="8">POST score + API key</text>
            <line x1="415" y1="95" x2="465" y2="110" stroke={C.dim} strokeWidth="1" markerEnd="url(#arr-gray)" strokeDasharray="3 2" />
            <line x1="415" y1="225" x2="465" y2="195" stroke={C.purple} strokeWidth="1" markerEnd="url(#arr-purple)" strokeDasharray="3 2" />
            <line x1="635" y1="130" x2="685" y2="130" stroke={C.amber} strokeWidth="2" markerEnd="url(#arr-amber)" />
            <text x="660" y="122" textAnchor="middle" fill={C.amber} fontSize="8">SDK calls</text>
            <line x1="770" y1="190" x2="770" y2="210" stroke={C.dim} strokeWidth="1" markerEnd="url(#arr-gray)" />
          </svg>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: "DynamoDB Single-Table", body: "One table, two GSIs. GSI1 stores scores as a numeric sort key — querying top-N is a single DynamoDB Query with ScanIndexForward=false. No full scans." },
            { title: "Partial Prerendering",  body: "Next.js 16 PPR serves a static HTML shell from the CDN edge instantly. Live scores stream in behind a Suspense boundary — fast first paint + fresh data." },
            { title: "TTL-based multi-period", body: "Each score submission writes 4 items (all/daily/weekly/monthly) transactionally. Period items carry a TTL attribute — DynamoDB deletes them automatically." },
          ].map((d) => (
            <div key={d.title} className="border border-border rounded-xl p-5 bg-card">
              <h3 className="font-semibold text-sm mb-2">{d.title}</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">{d.body}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
