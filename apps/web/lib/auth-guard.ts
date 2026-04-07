import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { AUTH_ROUTES } from "@/lib/constants"

/**
 * Server-side auth guard for use in Server Components and Route Handlers.
 * Redirects unauthenticated users to the login page.
 */
export async function requireAuth() {
  const session = await auth()

  if (!session?.user) {
    redirect(AUTH_ROUTES.login)
  }

  return session
}
