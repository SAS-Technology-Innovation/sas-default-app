# SAS Default App

A production-ready Next.js monorepo template for bootstrapping new projects. Clone it, swap out the placeholder auth, and start building.

This template gives you a layered architecture with authentication, AI safety guardrails, APCA AAA 3.0 accessibility, error boundaries, and comprehensive tooling — all wired together and passing CI from day one.

## Tech Stack

| Category      | Technology                                                       |
| ------------- | ---------------------------------------------------------------- |
| Framework     | Next.js 16 (App Router, React Server Components, Turbopack)      |
| UI            | shadcn/ui + Radix UI + Tailwind CSS v4 (OKLCH color tokens)      |
| Auth          | NextAuth v5 (JWT sessions, Credentials provider, no DB required) |
| AI Safety     | Rate limiting, prompt injection detection, PII redaction         |
| Accessibility | APCA AAA 3.0 contrast algorithm, skip links, focus management    |
| Monorepo      | Turborepo + pnpm workspaces                                      |
| Testing       | Vitest + Testing Library + jsdom                                 |
| CI/CD         | GitHub Actions + Husky + lint-staged                             |
| Language      | TypeScript 5.9 (strict mode)                                     |

## Quick Start

### Prerequisites

- **Node.js 22+** (see `.nvmrc` — use `nvm use` to switch)
- **pnpm 9+** (enabled via corepack: `corepack enable pnpm`)

### Setup

```bash
# 1. Clone the template
git clone https://github.com/SAS-Technology-Innovation/sas-default-app.git my-project
cd my-project

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp apps/web/.env.local.example apps/web/.env.local
# Generate a secret:
openssl rand -base64 32
# Paste it as the AUTH_SECRET value in apps/web/.env.local

# 4. Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The landing page is public. Navigating to `/dashboard` will redirect you to `/login` (auth is required). The placeholder auth accepts any non-empty email and password.

### Using as a GitHub Template

1. Click **"Use this template"** on the GitHub repo page
2. Name your new repository
3. Clone your new repo and follow steps 2-4 above
4. Search for `sas-default-app` across `package.json` files and rename to your project name
5. Update `APP_NAME` in `apps/web/lib/constants.ts`
6. Replace the placeholder `authorize` function in `apps/web/lib/auth.ts` with your actual auth backend

## Project Structure

```
.
├── apps/
│   └── web/                              # Next.js 16 application
│       ├── app/
│       │   ├── (auth)/login/page.tsx     # Public login page
│       │   ├── (dashboard)/              # Protected route group (requires auth)
│       │   │   └── dashboard/page.tsx    # /dashboard page
│       │   ├── api/auth/[...nextauth]/   # NextAuth API routes
│       │   ├── error.tsx                 # Root error boundary
│       │   ├── global-error.tsx          # Layout-level error boundary
│       │   ├── not-found.tsx             # 404 page
│       │   ├── loading.tsx               # Root loading skeleton
│       │   ├── layout.tsx                # Root layout (providers, fonts, a11y)
│       │   └── page.tsx                  # Landing page (public)
│       ├── components/
│       │   ├── providers.tsx             # Provider composition root
│       │   ├── error-boundary.tsx        # Reusable client error boundary
│       │   └── theme-provider.tsx        # Dark/light mode
│       ├── lib/
│       │   ├── auth.ts                   # NextAuth config (placeholder authorize)
│       │   ├── auth-guard.ts             # Server-side requireAuth() helper
│       │   └── constants.ts              # App name, route constants
│       ├── hooks/use-session.ts          # Typed session hook
│       ├── middleware.ts                 # Route protection
│       ├── __tests__/                    # Co-located tests
│       └── vitest.config.ts
├── packages/
│   ├── ui/                               # Shared shadcn/ui component library
│   │   └── src/
│   │       ├── components/               # Button, etc. (CVA variants)
│   │       ├── lib/utils.ts              # cn() class merge utility
│   │       └── styles/globals.css        # Tailwind v4 + design tokens
│   ├── ai-safety/                        # AI safety guardrails package
│   │   └── src/
│   │       ├── guardrails/               # Rate limiter, input sanitizer, output filter, token budget
│   │       ├── moderation/               # Content safety, PII redactor
│   │       └── middleware/               # Composed safety pipeline
│   ├── accessibility/                    # APCA AAA 3.0 accessibility package
│   │   └── src/
│   │       ├── apca/                     # Contrast calculation + validation
│   │       ├── components/               # SkipLink, VisuallyHidden, LiveRegion
│   │       ├── hooks/                    # useReducedMotion, useFocusTrap, useAnnounce
│   │       └── utils/                    # Color conversion, focus management
│   ├── eslint-config/                    # Shared ESLint configs
│   └── typescript-config/                # Shared TypeScript configs
├── turbo.json                            # Turborepo pipeline config
├── pnpm-workspace.yaml                   # Workspace definition
├── .github/workflows/ci.yml             # CI pipeline
└── CLAUDE.md                             # AI assistant context file
```

## Available Scripts

All scripts run through Turborepo and execute across all workspaces:

```bash
pnpm dev            # Start dev server with Turbopack (localhost:3000)
pnpm build          # Build all workspaces
pnpm typecheck      # Type check all workspaces
pnpm lint           # Lint all workspaces (ESLint)
pnpm test           # Run all tests (Vitest)
pnpm format         # Format all code (Prettier)
pnpm format:check   # Check formatting without modifying files
```

To target a single workspace:

```bash
pnpm --filter web dev
pnpm --filter web test
pnpm --filter @workspace/ai-safety typecheck
```

## Authentication

### How It Works

Authentication uses **NextAuth v5** with JWT sessions — no database required for session storage.

- **Middleware** (`apps/web/middleware.ts`) runs `auth()` on every request and redirects unauthenticated users to `/login`
- **Route groups** separate public routes `(auth)` from protected routes `(dashboard)`
- **Server-side auth** via `requireAuth()` in server components
- **Client-side auth** via `useSession()` hook in client components

### What You Need to Change

The `authorize` function in `apps/web/lib/auth.ts` is a **placeholder** that accepts any non-empty email/password. Before deploying, you must replace it with your actual authentication logic:

```typescript
// apps/web/lib/auth.ts — replace the authorize function
async authorize(credentials) {
  const email = credentials?.email as string | undefined
  const password = credentials?.password as string | undefined

  if (!email || !password) return null

  // TODO: Replace with your auth backend
  // Example: const user = await db.user.findUnique({ where: { email } })
  // Example: const valid = await bcrypt.compare(password, user.passwordHash)
  return { id: "1", email, name: email.split("@")[0] }
}
```

### Adding Protected Routes

```tsx
// apps/web/app/(dashboard)/your-route/page.tsx
import { requireAuth } from "@/lib/auth-guard"

export default async function YourPage() {
  const session = await requireAuth() // redirects to /login if unauthenticated
  return <div>Hello {session.user?.name}</div>
}
```

Any page inside the `(dashboard)` route group is automatically protected by middleware. Use `requireAuth()` in server components to access the session.

### Adding Public Routes

Place pages under `apps/web/app/(auth)/` or directly under `apps/web/app/`. Update the middleware matcher in `apps/web/middleware.ts` if needed.

## AI Safety Package

The `@workspace/ai-safety` package provides a composable middleware pipeline for AI-powered API routes. It chains multiple safety checks into a single function call:

**Pipeline:** Rate limit → Sanitize input → Content safety check → Token budget → [Your AI call] → Filter output → Redact PII

### Usage

```typescript
import { createAiSafetyMiddleware } from "@workspace/ai-safety/middleware"

const safeAi = createAiSafetyMiddleware({
  rateLimit: { maxRequests: 10, windowMs: 60_000 },
  sanitize: { sensitivity: "medium" },
  tokenBudget: { maxTokensPerUser: 100_000, windowMs: 3_600_000 },
  contentSafety: { categories: ["violence", "hate_speech"] },
  piiRedactor: { patterns: ["email", "phone", "ssn"] },
})

// In your API route handler:
const result = await safeAi(
  { userId: session.user.id, input: userMessage },
  async (sanitizedInput) => {
    // Call your AI provider here (OpenAI, Anthropic, etc.)
    const response = await callAiProvider(sanitizedInput)
    return { output: response.text, tokensUsed: response.usage.total_tokens }
  }
)

if (!result.success) {
  return Response.json({ error: result.error }, { status: 400 })
}
return Response.json({ message: result.output })
```

### Individual Components

Each component can also be used standalone:

| Module          | Import                                            | Purpose                                   |
| --------------- | ------------------------------------------------- | ----------------------------------------- |
| Rate Limiter    | `@workspace/ai-safety/guardrails/rate-limiter`    | Sliding window per-user rate limiting     |
| Input Sanitizer | `@workspace/ai-safety/guardrails/input-sanitizer` | Prompt injection detection & sanitization |
| Output Filter   | `@workspace/ai-safety/guardrails/output-filter`   | Filter sensitive patterns from AI output  |
| Token Budget    | `@workspace/ai-safety/guardrails/token-budget`    | Per-user token usage tracking & limits    |
| Content Safety  | `@workspace/ai-safety/moderation/content-safety`  | Content category flagging                 |
| PII Redactor    | `@workspace/ai-safety/moderation/pii-redactor`    | Detect and redact emails, phones, SSNs    |

## Accessibility Package

The `@workspace/accessibility` package implements **APCA AAA 3.0** (Advanced Perceptual Contrast Algorithm), the next-generation contrast standard replacing WCAG 2.x ratios.

### APCA Contrast Thresholds

| Use Case           | Minimum Lc Value |
| ------------------ | ---------------- |
| Body text          | Lc >= 90         |
| Large text (24px+) | Lc >= 75         |
| Non-text UI        | Lc >= 60         |

### Usage

```typescript
import { calcAPCA } from "@workspace/accessibility/apca/contrast"
import { meetsThreshold } from "@workspace/accessibility/apca/validate"
import { APCA_THRESHOLDS } from "@workspace/accessibility/apca/thresholds"

// Calculate contrast between text and background
const lc = calcAPCA("#1a1a1a", "#ffffff") // ~106 Lc (dark on light)
const passes = meetsThreshold(lc, APCA_THRESHOLDS.BODY_TEXT) // true
```

### Included Components

- **`SkipLink`** — "Skip to main content" link for keyboard navigation (already in root layout)
- **`VisuallyHidden`** — Screen-reader-only text
- **`LiveRegion`** — ARIA live region for dynamic announcements (already in root layout)

### Included Hooks

- **`useReducedMotion()`** — Detects `prefers-reduced-motion` media query
- **`useFocusTrap(ref)`** — Traps focus within a container (modals, dialogs)
- **`useAnnounce()`** — Programmatic screen reader announcements

## Adding shadcn Components

```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add form
```

Components install to `packages/ui/src/components/` and are imported with the `@workspace/ui` alias:

```tsx
import { Button } from "@workspace/ui/components/button"
import { Dialog } from "@workspace/ui/components/dialog"
```

## Adding a New Workspace Package

1. Create `packages/your-package/` with a `package.json`:
   ```json
   {
     "name": "@workspace/your-package",
     "version": "0.0.0",
     "type": "module",
     "private": true,
     "exports": {
       "./*": "./src/*.ts"
     }
   }
   ```
2. Add a `tsconfig.json` extending `@workspace/typescript-config/base.json` with `"module": "ESNext"` and `"moduleResolution": "Bundler"`
3. Add `"@workspace/your-package": "workspace:*"` to `apps/web/package.json` dependencies
4. Add `"@workspace/your-package"` to the `transpilePackages` array in `apps/web/next.config.mjs`
5. Run `pnpm install`
6. Use **extensionless imports** — do not use `.js` extensions in import paths

## Testing

Tests use **Vitest** with **Testing Library** in a **jsdom** environment.

```bash
pnpm test             # Run all tests once
pnpm --filter web test:watch   # Watch mode for the web app
```

### Writing Tests

Tests live in `__tests__/` directories co-located with source code:

```
apps/web/__tests__/app/page.test.tsx
apps/web/__tests__/components/error-boundary.test.tsx
packages/ai-safety/src/__tests__/rate-limiter.test.ts
packages/accessibility/src/__tests__/apca-contrast.test.ts
```

```tsx
import { render, screen, cleanup } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

afterEach(() => cleanup()) // Required — jsdom reuses the DOM between tests

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent />)
    expect(screen.getByRole("heading")).toHaveTextContent("Hello")
  })
})
```

### Testing Conventions

- Always call `cleanup()` in `afterEach` — jsdom reuses the document body across renders
- Prefer accessible queries: `getByRole`, `getByText`, `getByLabelText` over `getByTestId`
- Use `getAllByRole` when multiple matching elements are expected
- Setup file at `apps/web/vitest.setup.ts` loads `@testing-library/jest-dom` matchers

## CI/CD

### GitHub Actions

The CI pipeline (`.github/workflows/ci.yml`) runs on pushes to `main` and pull requests:

1. Install dependencies (`pnpm install --frozen-lockfile`)
2. Type check (`pnpm typecheck`)
3. Lint (`pnpm lint`)
4. Format check (`pnpm format:check`)
5. Build (`pnpm build`)
6. Test (`pnpm test`)

### Pre-commit Hooks

Husky runs lint-staged on every commit:

- **TypeScript/JavaScript files** — ESLint fix + Prettier format
- **JSON, Markdown, YAML, CSS files** — Prettier format

If the pre-commit hook fails, fix the reported issues and commit again. Do not skip with `--no-verify`.

## Environment Variables

| Variable      | Location              | Purpose                                                 |
| ------------- | --------------------- | ------------------------------------------------------- |
| `AUTH_SECRET` | `apps/web/.env.local` | NextAuth session encryption key                         |
| `AUTH_URL`    | `apps/web/.env.local` | NextAuth base URL (defaults to `http://localhost:3000`) |

Generate `AUTH_SECRET` with:

```bash
openssl rand -base64 32
```

Copy `apps/web/.env.local.example` to `apps/web/.env.local` and fill in the values. Never commit `.env.local` to version control.

## Customization Checklist

After cloning this template for a new project:

- [ ] Rename the project in `package.json` files (`sas-default-app` → your name)
- [ ] Update `APP_NAME` and `APP_DESCRIPTION` in `apps/web/lib/constants.ts`
- [ ] Replace the placeholder `authorize` function in `apps/web/lib/auth.ts`
- [ ] Generate and set `AUTH_SECRET` in `apps/web/.env.local`
- [ ] Update this README with your project-specific information
- [ ] Remove or modify the example dashboard page
- [ ] Configure AI safety middleware settings for your use case
- [ ] Verify APCA contrast compliance for your color palette

## Documentation

- [Getting Started](docs/getting-started.md) — Setup, configuration, and first steps
- [Architecture](docs/architecture.md) — System design, patterns, and data flow
- [Coding Conventions](docs/coding-conventions.md) — Standards and best practices
- [Contributing](CONTRIBUTING.md) — Branch naming, commit format, PR process
- [Changelog](CHANGELOG.md) — Release history
- [CLAUDE.md](CLAUDE.md) — AI assistant context for working with this codebase
