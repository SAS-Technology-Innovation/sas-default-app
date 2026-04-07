export const APP_NAME = "SAS Default App"
export const APP_DESCRIPTION = "A production-ready Next.js monorepo template"

export const AUTH_ROUTES = {
  login: "/login",
  callback: "/api/auth",
} as const

export const PUBLIC_ROUTES = ["/", "/login", "/api/auth"] as const
