# RankForge

**Leaderboard-as-a-service for game developers — built for the [H0: Hack the Zero Stack](https://h0hackathon.devpost.com/) hackathon.**

Track 3: Million-scale global app · AWS DynamoDB + Vercel


[![Watch Demo](https://img.shields.io/badge/YouTube-Watch%20Demo-FF0000?style=flat&logo=youtube&logoColor=white)](https://www.youtube.com/watch?v=X3iKoFZClI0)

---

## What it does

RankForge gives game developers a drop-in leaderboard API and live UI in minutes. Game clients POST scores via a key-authenticated REST API. Players see their rank update in real time. Multi-period boards (all-time, daily, weekly, monthly) run automatically with DynamoDB TTL-based cleanup — no cron jobs needed.

## Architecture

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

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16.2, React 19, Tailwind CSS |
| Database | AWS DynamoDB (single-table design + GSI) |
| Deployment | Vercel |
| Real-time | Server-Sent Events |
| Caching | Next.js 16 `'use cache'` (game metadata) |

## Getting started

### 1. Prerequisites

- Node.js 20+
- AWS account with DynamoDB access
- Vercel account

### 2. Environment variables

```bash
cp .env.local.example .env.local
```

```env
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
DYNAMODB_TABLE_NAME=rankforge
```

### 3. Create the DynamoDB table

```bash
npm install
npm run db:create
```

Then enable TTL on the `ttl` attribute in the AWS console (DynamoDB → Tables → rankforge → Additional settings → TTL).

### 4. Run locally

```bash
npm run dev
```

### 5. Deploy

```bash
vercel deploy
```

Add the environment variables to your Vercel project.

## API

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
