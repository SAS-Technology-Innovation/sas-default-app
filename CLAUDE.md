# CLAUDE.md - AI Assistant Guide

## Project Overview

Next.js monorepo template using Turborepo, shadcn/ui, and pnpm workspaces.

## Structure

```
apps/web/          - Next.js 16 app (App Router, RSC, Turbopack)
packages/ui/       - Shared shadcn/ui component library
packages/ai-safety/     - AI safety guardrails and moderation
packages/accessibility/ - APCA AAA 3.0 contrast, a11y hooks/components
packages/eslint-config/ - Shared ESLint configs
packages/typescript-config/ - Shared TS configs
```

## Commands

```bash
pnpm dev          # Start dev server (localhost:3000)
pnpm build        # Build all workspaces
pnpm typecheck    # Type check all workspaces
pnpm lint         # Lint all workspaces
pnpm test         # Run all tests
pnpm format       # Format code
```

## Key Decisions

- **Package manager:** pnpm with workspace protocol (`workspace:*`)
- **Auth:** NextAuth v5 (beta) with Credentials provider, JWT sessions, no database
- **Styling:** Tailwind CSS v4 with CSS variables, `cn()` utility from `@workspace/ui`
- **Components:** shadcn/ui components live in `packages/ui/src/components/`
- **Server Components by default** - use `"use client"` only when needed
- **TypeScript strict mode** with `noUncheckedIndexedAccess`
- **APCA AAA 3.0** contrast algorithm (not WCAG 2.x ratios)

## Adding a shadcn Component

```bash
npx shadcn@latest add <component-name>
```

Components are added to `packages/ui/src/components/`.

## Adding a Route

Create `apps/web/app/(dashboard)/your-route/page.tsx` for protected routes.
Create `apps/web/app/(auth)/your-route/page.tsx` for auth-related routes.
Use `requireAuth()` from `@/lib/auth-guard` in server components for protection.

## Adding a Provider

Add to `apps/web/components/providers.tsx` - wraps all providers in composition root.

## Testing

- Vitest + Testing Library for unit/component tests
- Tests in `__tests__/` directories
- Run single package: `pnpm --filter web test`

## AI Safety Package

Always use `createAiSafetyMiddleware()` when building AI API routes.
Pipeline: rate limit -> sanitize input -> content safety -> [AI call] -> filter output -> redact PII.

## Conventions

- File naming: kebab-case
- Component naming: PascalCase
- Imports: `@/` for apps/web, `@workspace/` for packages
- No `any` types
- Conventional commits
