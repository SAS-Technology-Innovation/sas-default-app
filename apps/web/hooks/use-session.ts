"use client"

import { useSession as useNextAuthSession } from "next-auth/react"

/**
 * Typed wrapper around NextAuth's useSession hook.
 * Provides session data with proper typing for client components.
 */
export function useSession() {
  const session = useNextAuthSession()
  return session
}
