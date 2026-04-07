# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.0.1] - 2026-04-07

### Added

- Initial monorepo scaffold with Turborepo and pnpm workspaces
- Next.js 16 app with App Router, RSC, and Turbopack
- shadcn/ui component library (`@workspace/ui`)
- NextAuth v5 authentication with JWT sessions and Credentials provider
- AI safety package (`@workspace/ai-safety`) with rate limiting, prompt injection detection, output filtering, PII redaction, and content moderation
- Accessibility package (`@workspace/accessibility`) with APCA AAA 3.0 contrast algorithm, skip links, live regions, focus management hooks
- Error boundaries (root, global, and reusable component)
- Provider composition pattern (SessionProvider + ThemeProvider)
- Route protection middleware
- Vitest + Testing Library test infrastructure
- GitHub Actions CI pipeline
- Husky + lint-staged pre-commit hooks
- Comprehensive documentation (README, CONTRIBUTING, CLAUDE.md, docs/)
