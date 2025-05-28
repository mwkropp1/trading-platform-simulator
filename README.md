# Trading Platform Simulator

A practice trading simulator where users can buy/sell stocks using simulated funds, track performance, and learn from AI-driven tips.

## Tech Stack
- Node.js + Express (TypeScript)
- PostgreSQL (local, later AWS RDS)
- Knex.js for migrations and queries
- React (planned later)

## Quickstart
```bash
cp .env.example .env
npm install
npm run migrate
```

## Migrations
1. users – app users
2. assets – tradable assets (stocks, crypto, etc.)
3. holdings – asset balances by user
4. trades – individual buy/sell transactions
5. connections – social connections between users