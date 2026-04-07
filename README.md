# Next.js Template

A production-ready Next.js monorepo template with authentication, AI safety guardrails, APCA AAA 3.0 accessibility, and comprehensive tooling.

## Tech Stack

- **Framework:** Next.js 16 (App Router, React Server Components, Turbopack)
- **UI:** shadcn/ui + Radix UI + Tailwind CSS v4
- **Auth:** NextAuth v5 (JWT sessions, Credentials provider)
- **AI Safety:** Rate limiting, prompt injection detection, PII redaction, content moderation
- **Accessibility:** APCA AAA 3.0 contrast algorithm, skip links, live regions, focus management
- **Monorepo:** Turborepo + pnpm workspaces
- **Testing:** Vitest + Testing Library
- **CI/CD:** GitHub Actions + Husky + lint-staged

## Quick Start

### Prerequisites

- Node.js 22+ (see `.nvmrc`)
- pnpm 9+

### Setup

```bash
# Clone the template
git clone <repo-url> my-project
cd my-project

# Install dependencies
pnpm install

# Set up environment variables
cp apps/web/.env.local.example apps/web/.env.local
# Edit .env.local with your AUTH_SECRET (generate with: openssl rand -base64 32)

# Start development
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

| Directory                     | Purpose                                             |
| ----------------------------- | --------------------------------------------------- |
| `apps/web/`                   | Next.js application                                 |
| `packages/ui/`                | Shared shadcn/ui component library                  |
| `packages/ai-safety/`         | AI safety guardrails and content moderation         |
| `packages/accessibility/`     | APCA contrast validation, a11y hooks and components |
| `packages/eslint-config/`     | Shared ESLint configurations                        |
| `packages/typescript-config/` | Shared TypeScript configurations                    |

## Scripts

```bash
pnpm dev          # Start dev server with Turbopack
pnpm build        # Build all workspaces
pnpm typecheck    # Type check all workspaces
pnpm lint         # Lint all workspaces
pnpm test         # Run all tests
pnpm format       # Format code with Prettier
```

## Adding shadcn Components

```bash
npx shadcn@latest add <component-name>
```

Components are installed to `packages/ui/src/components/` and can be imported:

```tsx
import { Button } from "@workspace/ui/components/button"
```

## Documentation

- [Getting Started](docs/getting-started.md) - Setup, configuration, and first steps
- [Architecture](docs/architecture.md) - System design and patterns
- [Coding Conventions](docs/coding-conventions.md) - Standards and best practices
- [Contributing](CONTRIBUTING.md) - How to contribute
- [Changelog](CHANGELOG.md) - Release history
