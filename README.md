# Trading Platform Simulator

A practice trading simulator where users can buy/sell stocks using simulated funds, track performance, and learn from AI-driven tips.

## Tech Stack

- Node.js + Express (TypeScript)
- PostgreSQL
- Knex.js for migrations and queries
- Zod for validation
- JWT for authentication
- Jest for testing

## Features

- [x] User authentication (JWT)
- [x] User registration and login
- [x] Request validation with Zod
- [ ] Asset management
- [ ] Trading functionality
- [ ] Portfolio tracking
- [ ] Social connections
- [ ] AI-driven trading tips

## Project Structure

```
src/
├── controllers/     # Request handlers
├── middlewares/     # Express middlewares
├── repositories/    # Database queries
├── routes/          # API routes
├── schemas/         # Zod validation schemas
├── services/        # Business logic
└── utils/           # Helper functions

tests/
├── unit/          # Unit tests
├── integration/   # Integration tests
└── e2e/           # End-to-end tests
```

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm 9+

### Local Development

1. Clone the repository

```bash
git clone https://github.com/mwkropp1/practice-trading-platform.git
cd practice-trading-platform
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials, JWT secret
```

4. Run migrations

```bash
npm run migrate
```

5. Start development server

```bash
npm run dev
```

## Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- tests/unit/services/authService.test.ts

# Run tests with coverage
npm run test:coverage
```

## API Documentation

### Authentication Endpoints

- POST `/api/v1/auth/register` - Register new user
- POST `/api/v1/auth/login` - Login user
- GET `/api/v1/auth/me` - Get current user

### User Endpoints

- GET `/api/v1/users/:id` - Get user by ID

## License

MIT
