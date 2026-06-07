export const metadata = {
  title: "RankForge — Architecture",
};

export default function ArchitecturePage() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-primary font-bold text-xl">⬡</span>
            <span className="font-bold text-lg">RankForge</span>
          </div>
          <h1 className="text-2xl font-bold mb-1">Architecture Diagram</h1>
          <p className="text-zinc-400 text-sm">H0 Hackathon · Track 3 · Million-scale Global App</p>
        </div>

        {/* Diagram */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 overflow-x-auto">
          <svg
            viewBox="0 0 900 520"
            className="w-full max-w-4xl mx-auto"
            style={{ fontFamily: "monospace" }}
          >
            {/* ── Background lanes ── */}
            <rect x="10" y="10" width="870" height="500" rx="12" fill="#0a0a0a" stroke="#27272a" strokeWidth="1" />

            {/* Lane: Client */}
            <rect x="30" y="30" width="180" height="460" rx="8" fill="#111" stroke="#3f3f46" strokeWidth="1" strokeDasharray="4 3" />
            <text x="120" y="52" textAnchor="middle" fill="#71717a" fontSize="11" fontWeight="bold" letterSpacing="1">CLIENT</text>

            {/* Lane: Vercel Edge */}
            <rect x="230" y="30" width="200" height="460" rx="8" fill="#111" stroke="#3f3f46" strokeWidth="1" strokeDasharray="4 3" />
            <text x="330" y="52" textAnchor="middle" fill="#71717a" fontSize="11" fontWeight="bold" letterSpacing="1">VERCEL EDGE / CDN</text>

            {/* Lane: Vercel Functions */}
            <rect x="450" y="30" width="200" height="460" rx="8" fill="#111" stroke="#3f3f46" strokeWidth="1" strokeDasharray="4 3" />
            <text x="550" y="52" textAnchor="middle" fill="#71717a" fontSize="11" fontWeight="bold" letterSpacing="1">VERCEL FUNCTIONS</text>

            {/* Lane: AWS */}
            <rect x="670" y="30" width="200" height="460" rx="8" fill="#111" stroke="#3f3f46" strokeWidth="1" strokeDasharray="4 3" />
            <text x="770" y="52" textAnchor="middle" fill="#71717a" fontSize="11" fontWeight="bold" letterSpacing="1">AWS (us-east-1)</text>

            {/* ── Nodes ── */}

            {/* Browser */}
            <rect x="45" y="70" width="150" height="50" rx="8" fill="#18181b" stroke="#52525b" strokeWidth="1.5" />
            <text x="120" y="91" textAnchor="middle" fill="#e4e4e7" fontSize="12" fontWeight="bold">🌐 Browser</text>
            <text x="120" y="108" textAnchor="middle" fill="#71717a" fontSize="10">Game + Leaderboard UI</text>

            {/* Game Client */}
            <rect x="45" y="170" width="150" height="50" rx="8" fill="#18181b" stroke="#52525b" strokeWidth="1.5" />
            <text x="120" y="191" textAnchor="middle" fill="#e4e4e7" fontSize="12" fontWeight="bold">🎮 Game Client</text>
            <text x="120" y="208" textAnchor="middle" fill="#71717a" fontSize="10">Score submission</text>

            {/* Static Shell */}
            <rect x="245" y="70" width="170" height="50" rx="8" fill="#18181b" stroke="#4ade80" strokeWidth="1.5" />
            <text x="330" y="91" textAnchor="middle" fill="#4ade80" fontSize="12" fontWeight="bold">⚡ Static Shell</text>
            <text x="330" y="108" textAnchor="middle" fill="#71717a" fontSize="10">PPR · served from edge</text>

            {/* SSE Stream */}
            <rect x="245" y="200" width="170" height="50" rx="8" fill="#18181b" stroke="#a78bfa" strokeWidth="1.5" />
            <text x="330" y="221" textAnchor="middle" fill="#a78bfa" fontSize="12" fontWeight="bold">📡 SSE Stream</text>
            <text x="330" y="238" textAnchor="middle" fill="#71717a" fontSize="10">/api/stream/[gameId]</text>

            {/* API Routes box */}
            <rect x="465" y="70" width="170" height="180" rx="8" fill="#18181b" stroke="#52525b" strokeWidth="1.5" />
            <text x="550" y="93" textAnchor="middle" fill="#e4e4e7" fontSize="12" fontWeight="bold">API Routes</text>
            <line x1="465" y1="105" x2="635" y2="105" stroke="#3f3f46" strokeWidth="1" />
            <text x="478" y="124" fill="#71717a" fontSize="10">POST /api/scores</text>
            <text x="478" y="142" fill="#71717a" fontSize="10">GET  /api/leaderboard</text>
            <text x="478" y="160" fill="#71717a" fontSize="10">GET  /api/leaderboard/rank</text>
            <text x="478" y="178" fill="#71717a" fontSize="10">POST /api/games</text>
            <text x="478" y="196" fill="#71717a" fontSize="10">GET  /api/games</text>
            <text x="478" y="214" fill="#4ade80" fontSize="10">SSE  /api/stream</text>
            <text x="478" y="232" fill="#71717a" fontSize="10" fontStyle="italic">5s push interval</text>

            {/* DynamoDB */}
            <rect x="685" y="70" width="170" height="120" rx="8" fill="#18181b" stroke="#f59e0b" strokeWidth="2" />
            <text x="770" y="95" textAnchor="middle" fill="#f59e0b" fontSize="13" fontWeight="bold">DynamoDB</text>
            <text x="770" y="113" textAnchor="middle" fill="#71717a" fontSize="10">Single table · On-demand</text>
            <line x1="685" y1="125" x2="855" y2="125" stroke="#3f3f46" strokeWidth="1" />
            <text x="698" y="143" fill="#71717a" fontSize="10">PK / SK  →  main table</text>
            <text x="698" y="161" fill="#71717a" fontSize="10">GSI1  →  score-sorted</text>
            <text x="698" y="179" fill="#a78bfa" fontSize="10">apiKey-index  →  auth</text>

            {/* TTL box */}
            <rect x="685" y="210" width="170" height="50" rx="8" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
            <text x="770" y="231" textAnchor="middle" fill="#e4e4e7" fontSize="11" fontWeight="bold">TTL auto-expiry</text>
            <text x="770" y="248" textAnchor="middle" fill="#71717a" fontSize="10">daily · weekly · monthly</text>

            {/* Data model legend */}
            <rect x="465" y="295" width="390" height="175" rx="8" fill="#0d0d0d" stroke="#27272a" strokeWidth="1" />
            <text x="480" y="316" fill="#71717a" fontSize="10" fontWeight="bold" letterSpacing="0.5">DYNAMODB SINGLE-TABLE DESIGN</text>
            <line x1="465" y1="323" x2="855" y2="323" stroke="#27272a" strokeWidth="1" />

            {/* Table header */}
            <text x="480" y="340" fill="#52525b" fontSize="9">PK</text>
            <text x="580" y="340" fill="#52525b" fontSize="9">SK</text>
            <text x="680" y="340" fill="#52525b" fontSize="9">GSI1PK</text>
            <text x="780" y="340" fill="#52525b" fontSize="9">GSI1SK</text>

            {/* Row 1 */}
            <rect x="465" y="345" width="390" height="20" rx="0" fill="#18181b" />
            <text x="480" y="359" fill="#4ade80" fontSize="9">GAME#abc</text>
            <text x="580" y="359" fill="#4ade80" fontSize="9">#META</text>
            <text x="680" y="359" fill="#52525b" fontSize="9">—</text>
            <text x="780" y="359" fill="#52525b" fontSize="9">—</text>

            {/* Row 2 */}
            <text x="480" y="379" fill="#e4e4e7" fontSize="9">GAME#abc</text>
            <text x="580" y="379" fill="#e4e4e7" fontSize="9">PLAYER#p1</text>
            <text x="680" y="379" fill="#a78bfa" fontSize="9">LEADERBOARD#abc#ALL</text>
            <text x="780" y="379" fill="#a78bfa" fontSize="9">98750</text>

            {/* Row 3 */}
            <rect x="465" y="385" width="390" height="20" rx="0" fill="#18181b" />
            <text x="480" y="399" fill="#e4e4e7" fontSize="9">GAME#abc#DAILY#2026-06-07</text>
            <text x="580" y="399" fill="#e4e4e7" fontSize="9">PLAYER#p1</text>
            <text x="680" y="399" fill="#a78bfa" fontSize="9">LEADERBOARD#…#DAILY</text>
            <text x="780" y="399" fill="#a78bfa" fontSize="9">98750</text>

            {/* Row 4 */}
            <text x="480" y="419" fill="#71717a" fontSize="9">GAME#abc#WEEKLY#2026-W23</text>
            <text x="580" y="419" fill="#71717a" fontSize="9">PLAYER#p1</text>
            <text x="680" y="419" fill="#71717a" fontSize="9">LEADERBOARD#…#WEEKLY</text>
            <text x="780" y="419" fill="#71717a" fontSize="9">98750 + TTL</text>

            <text x="480" y="452" fill="#52525b" fontSize="9" fontStyle="italic">Query GSI1 with ScanIndexForward=false → top-N leaderboard in one request</text>

            {/* ── Arrows ── */}

            {/* Browser → Static Shell */}
            <line x1="195" y1="90" x2="245" y2="95" stroke="#4ade80" strokeWidth="1.5" markerEnd="url(#arr-green)" />
            <text x="218" y="85" textAnchor="middle" fill="#4ade80" fontSize="8">GET page</text>

            {/* Browser → SSE Stream */}
            <line x1="195" y1="215" x2="245" y2="220" stroke="#a78bfa" strokeWidth="1.5" markerEnd="url(#arr-purple)" strokeDasharray="4 3" />
            <text x="218" y="210" textAnchor="middle" fill="#a78bfa" fontSize="8">EventSource</text>

            {/* Game Client → API Routes */}
            <line x1="195" y1="195" x2="465" y2="150" stroke="#71717a" strokeWidth="1.5" markerEnd="url(#arr-gray)" />
            <text x="330" y="162" textAnchor="middle" fill="#71717a" fontSize="8">POST score + API key</text>

            {/* Static Shell → API Routes */}
            <line x1="415" y1="95" x2="465" y2="110" stroke="#52525b" strokeWidth="1" markerEnd="url(#arr-gray)" strokeDasharray="3 2" />

            {/* SSE → API Routes */}
            <line x1="415" y1="225" x2="465" y2="195" stroke="#a78bfa" strokeWidth="1" markerEnd="url(#arr-purple)" strokeDasharray="3 2" />

            {/* API Routes → DynamoDB */}
            <line x1="635" y1="130" x2="685" y2="130" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arr-amber)" />
            <text x="660" y="122" textAnchor="middle" fill="#f59e0b" fontSize="8">SDK calls</text>

            {/* DynamoDB → TTL */}
            <line x1="770" y1="190" x2="770" y2="210" stroke="#3f3f46" strokeWidth="1" markerEnd="url(#arr-gray)" />

            {/* Arrow markers */}
            <defs>
              <marker id="arr-green" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#4ade80" />
              </marker>
              <marker id="arr-purple" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#a78bfa" />
              </marker>
              <marker id="arr-amber" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#f59e0b" />
              </marker>
              <marker id="arr-gray" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#52525b" />
              </marker>
            </defs>
          </svg>
        </div>

        {/* Key decisions */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: "DynamoDB Single-Table",
              body: "One table, two GSIs. GSI1 stores scores as a numeric sort key — querying top-N is a single DynamoDB Query with ScanIndexForward=false. No full scans.",
              color: "border-yellow-800/60 bg-yellow-950/20",
            },
            {
              title: "Partial Prerendering",
              body: "Next.js 16 PPR serves a static HTML shell from the CDN edge instantly. Live scores stream in behind a Suspense boundary — fast first paint + fresh data.",
              color: "border-primary/30 bg-primary/10",
            },
            {
              title: "TTL-based multi-period",
              body: "Each score submission writes 4 items (all/daily/weekly/monthly) transactionally. Period items carry a TTL attribute — DynamoDB deletes them automatically.",
              color: "border-purple-800/60 bg-purple-950/20",
            },
          ].map((d) => (
            <div key={d.title} className={`border rounded-xl p-5 ${d.color}`}>
              <h3 className="font-semibold text-sm mb-2">{d.title}</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">{d.body}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
