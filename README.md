<div align="center">

<img src="assets/banner.png" alt="banner" width="100%" />

# 🏅 RankForge

**Drop-in leaderboard-as-a-service for game developers — built for the H0 Hackathon.**

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![DynamoDB](https://img.shields.io/badge/DynamoDB-single--table-4053D6?style=flat-square&logo=amazondynamodb&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-deployed-000000?style=flat-square&logo=vercel)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Hackathon](https://img.shields.io/badge/H0%20Hackathon-Track%203-FF6B6B?style=flat-square)

</div>

<br/>

RankForge gives game developers a drop-in leaderboard API and live UI in minutes. Game clients POST scores via a key-authenticated REST API, players see their rank update in real time, and multi-period boards (all-time, daily, weekly, monthly) run automatically with DynamoDB TTL-based cleanup — no cron jobs needed. Built for the [H0: Hack the Zero Stack](https://h0hackathon.devpost.com/) hackathon on Track 3: Million-scale global app.

## ✨ Features

- **Key-authenticated REST API** — game clients submit scores with a single POST request
- **Multi-period leaderboards** — all-time, daily, weekly, and monthly boards with automatic TTL-based cleanup
- **Real-time score streaming** — Server-Sent Events push live score updates to all connected clients
- **DynamoDB single-table design** — GSI-backed leaderboard queries with O(1) reads at any scale
- **Partial Prerendering** — Next.js 16 PPR delivers a static shell instantly with streaming dynamic content via Suspense
- **Game metadata caching** — Next.js 16 `'use cache'` directive keeps game config reads off the hot path

## 🎥 Demo

[![Watch Demo](https://img.shields.io/badge/YouTube-Watch%20Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/watch?v=X3iKoFZClI0)

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16.2, React 19, Tailwind CSS |
| Database | AWS DynamoDB (single-table design + GSI) |
| Deployment | Vercel |
| Real-time | Server-Sent Events |
| Caching | Next.js 16 `'use cache'` (game metadata) |

## 📐 Architecture

```
Game Client
    │  POST /api/scores  (API key auth)
    ▼
Next.js API Routes (Vercel)
    │
    ├── DynamoDB single-table design
    │     PK: GAME#{gameId}  SK: SCORE#{score}#{playerId}
    │     GSI1: leaderboard queries (score desc, O(1) reads)
    │     TTL attribute: auto-expires daily/weekly/monthly entries
    │
    └── SSE stream  /api/stream/[gameId]
          → pushes score events to connected clients

Leaderboard Page  (Next.js 16 Partial Prerendering)
    ├── Static shell  (instant)
    └── Streaming dynamic content via Suspense
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- AWS account with DynamoDB access
- Vercel account

### Environment variables

```bash
cp .env.local.example .env.local
```

```env
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
DYNAMODB_TABLE_NAME=rankforge
```

### Create the DynamoDB table

```bash
npm install
npm run db:create
```

Then enable TTL on the `ttl` attribute in the AWS console (DynamoDB → Tables → rankforge → Additional settings → TTL).

### Run locally

```bash
npm run dev
```

### Deploy

```bash
vercel deploy
```

Add the environment variables to your Vercel project.

## 🔌 API

### Submit a score

```http
POST /api/scores
Authorization: Bearer <api-key>
Content-Type: application/json

{
  "gameId": "my-game",
  "playerId": "user-123",
  "playerName": "Alice",
  "score": 9850,
  "period": "daily"
}
```

### Get leaderboard

```http
GET /api/leaderboard/[gameId]?period=daily&limit=100
```

### Real-time stream

```http
GET /api/stream/[gameId]
Accept: text/event-stream
```

## 📄 License

MIT
