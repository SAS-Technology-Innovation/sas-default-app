# Contributing

## Development Setup

1. Install Node.js 22+ (use `nvm install` to match `.nvmrc`)
2. Enable pnpm: `corepack enable pnpm`
3. Install dependencies: `pnpm install`
4. Copy env file: `cp apps/web/.env.local.example apps/web/.env.local`
5. Start dev server: `pnpm dev`

## Branch Naming

Use descriptive branch names with a prefix:

- `feat/description` - New features
- `fix/description` - Bug fixes
- `chore/description` - Maintenance tasks
- `docs/description` - Documentation changes

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add user profile page
fix: resolve auth redirect loop
chore: update dependencies
docs: add deployment guide
test: add rate limiter tests
```

## Pre-commit Hooks

Husky runs lint-staged on every commit:

- TypeScript/JavaScript files: ESLint + Prettier
- JSON/Markdown/CSS/YAML files: Prettier

If hooks fail, fix the issues before committing.

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Ensure all checks pass: `pnpm build && pnpm typecheck && pnpm lint && pnpm test`
4. Push and create a PR using the template
5. Request review

## Adding Components

Add new shadcn/ui components:

```bash
npx shadcn@latest add <component-name>
```

## Adding Routes

- **Protected routes:** `apps/web/app/(dashboard)/your-route/page.tsx`
- **Auth routes:** `apps/web/app/(auth)/your-route/page.tsx`
- **API routes:** `apps/web/app/api/your-route/route.ts`

## Adding Packages

1. Create directory under `packages/`
2. Add `package.json` with `@workspace/` name
3. Add `tsconfig.json` extending shared config
4. Update `apps/web/next.config.mjs` transpilePackages if needed
5. Add to `apps/web/package.json` dependencies

## Accessibility

- Use APCA AAA 3.0 contrast thresholds (body text: Lc >= 90)
- Test keyboard navigation
- Use semantic HTML elements
- Add ARIA attributes where needed
- Use the `@workspace/accessibility` package utilities
