# KitneBheju

A modern expense splitting application inspired by Splitwise, built with Next.js 16, Prisma, PostgreSQL, Redis, and Docker.

## Features

- Secure JWT Authentication
- Create and Manage Groups
- Invite Members via Invite Code
- Add and Split Expenses
- Automatic Balance Calculation
- Settlement Suggestions
- Rate Limiting with Redis
- Responsive UI
- Dockerized Application

---

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend
- Next.js Route Handlers
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Zod Validation

### Infrastructure
- Redis (Upstash)
- Docker

---

## Project Structure

```text
app/
components/
lib/
prisma/
public/

Dockerfile
.dockerignore
package.json
README.md
```

---

## Environment Variables

Create a `.env` file.

```env
DATABASE_URL=

JWT_SECRET=

UPSTASH_REDIS_REST_URL=

UPSTASH_REDIS_REST_TOKEN=
```

---

## Running Locally

Install dependencies

```bash
npm install
```

Generate Prisma Client

```bash
npx prisma generate
```

Run database migrations

```bash
npx prisma migrate dev
```

Start the development server

```bash
npm run dev
```

---

## Running with Docker

Build the image

```bash
docker build -t kitnebheju .
```

Run the container

```bash
docker run --env-file .env -p 3000:3000 kitnebheju
```

---

## Available Scripts

```bash
npm run dev
```

Starts the development server.

```bash
npm run build
```

Creates a production build.

```bash
npm start
```

Runs the production server.

---

## Features Implemented

### Authentication

- User Signup
- User Login
- Logout
- Protected Routes
- JWT Authentication
- HTTP Only Cookies

### Groups

- Create Group
- Update Group
- Delete Group
- Join via Invite Code
- Leave Group

### Expenses

- Add Expense
- Delete Expense
- View Expense History

### Balances

- Automatic Balance Calculation
- Settlement Calculation

### Security

- Password Hashing (bcrypt)
- Zod Validation
- Rate Limiting
- Secure Cookies

---

## Docker

The project is fully containerized.

The Docker image contains:

- Linux (Alpine)
- Node.js
- Prisma Client
- Production Build

Environment variables are injected at runtime using:

```bash
docker run --env-file .env -p 3000:3000 kitnebheju
```

No secrets are stored inside the Docker image.

---

## Future Improvements

- Docker Compose
- Local PostgreSQL Container
- Local Redis Container
- CI/CD Pipeline
- AWS Deployment
- Kubernetes
- Expense Settlements
- Email Invitations

---

## License

This project is for learning and portfolio purposes.