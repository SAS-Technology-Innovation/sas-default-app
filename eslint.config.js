// Root-level ESLint config for a Turborepo workspace.
// App/package lint rules live in each workspace's eslint.config.js.
export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/.turbo/**",
      "**/coverage/**",
    ],
  },
]
