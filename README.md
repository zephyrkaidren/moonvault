# Moonvault

**A personal art vault with a Pixiv-style public gallery.**

Store your illustrations privately, at full quality and true aspect ratio, and choose which pieces to share on a public, browsable gallery - complete with tags, bookmarks, and rankings.

[![CI](https://github.com/zephyrkaidren/moonvault/actions/workflows/ci.yml/badge.svg)](https://github.com/zephyrkaidren/moonvault/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)

---

## About

Moonvault is a full-stack media platform combining two things that don't usually live in the same product: a private, quota-managed personal storage system (like Dropbox) and a public, social art gallery (like Pixiv or Pinterest). Every upload goes through an asynchronous processing pipeline — thumbnail generation, EXIF extraction, and perceptual-hash duplicate detection - before it's ever shown anywhere.

This project was built end-to-end as a solo full-stack engineering exercise, with a deliberate emphasis on real backend systems work (storage abstraction, async job processing, quota enforcement) rather than a purely CRUD-driven app.

## Features

**Storage & media pipeline**
- Per-user storage quotas, enforced against actual uploaded byte counts
- Provider-agnostic storage abstraction (`StorageProvider` interface) — swap the backing storage service without touching any application code
- Asynchronous processing via BullMQ: thumbnail generation (`sharp`), EXIF metadata extraction (GPS data deliberately never parsed), and perceptual-hash duplicate detection

**Public gallery**
- Cursor-paginated public feed, filterable by tag and image orientation
- Time-windowed ranking page (daily / weekly / monthly), ranked by bookmarks
- Artist profile pages with public stats
- Bookmarking, tagging, and per-image visibility control (public/private)

**Accounts**
- JWT-based authentication with httpOnly cookie storage (auth handled server-side via Next.js Route Handlers, never exposed to client-side JavaScript)
- Editable profile (display name, password) with real ownership checks throughout

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router), TypeScript, Tailwind CSS |
| Backend | NestJS, TypeScript |
| Database | PostgreSQL via Prisma (driver adapters) |
| Queue / Jobs | BullMQ + Redis |
| Image processing | `sharp`, `exifr`, `sharp-phash` |
| Object storage | S3-compatible, behind a swappable provider interface |
| CI/CD | GitHub Actions (lint, build, test on every PR) |

## Architecture

```mermaid
flowchart TD
    Client[Browser] --> Web[Next.js Frontend]
    Web -->|Server-side, cookie auth| API[NestJS API]
    API --> DB[(PostgreSQL)]
    API --> Queue[BullMQ / Redis]
    Queue --> Worker[Image Processor]
    Worker --> Storage[(Object Storage)]
    API --> Storage
    Worker --> DB
```

The frontend never talks to the backend directly from client-side JavaScript - every authenticated request is proxied through a Next.js Route Handler running server-side, which attaches the JWT from an httpOnly cookie. This keeps the auth token completely inaccessible to browser JavaScript.

## Getting started

**Prerequisites:** Node.js 22+, pnpm, Docker.

```bash
git clone https://github.com/codebyrashel/moonvault.git
cd moonvault
pnpm install
```

Start the local dependencies (PostgreSQL, Redis):

```bash
make db-up
```

Set up environment variables - copy each `.env.example` to `.env` in both `apps/api` and `apps/web`, and fill in the values.

Run database migrations:

```bash
cd apps/api
pnpm dlx prisma migrate dev
```

Run both apps (in separate terminals):

```bash
# API
cd apps/api && pnpm run start:dev

# Frontend
cd apps/web && pnpm run dev
```

Run the full check suite (lint, build, test) from the repo root:

```bash
pnpm run lint
pnpm run build
pnpm run test
```

## Project structure

```
moonvault/
├── apps/
│   ├── api/          # NestJS backend
│   └── web/          # Next.js frontend
├── packages/
│   └── shared/       # Shared types/utilities (reserved)
├── docker-compose.dev.yml
└── Makefile           # Local dev container management
```

## Roadmap

- [x] Auth, quota system, and storage abstraction
- [x] Upload, processing pipeline (thumbnails, EXIF, duplicate detection)
- [x] Public gallery, bookmarks, tags, ranking
- [x] Frontend: auth pages, dashboard, gallery, artist profiles
- [x] Production-grade auth hardening (password reset, stronger validation)
- [x] Finalized cloud storage backend
- [ ] Deployment

## License

MIT - see [LICENSE](./LICENSE).
