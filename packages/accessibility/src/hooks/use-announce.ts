"use client"

import { useCallback, useRef } from "react"

/**
 * Provides a function to announce messages to screen readers
 * via an ARIA live region. Pairs with the `<LiveRegion />` component.
 */
export function useAnnounce() {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  const announce = useCallback(
    (
      message: string,
      options: { politeness?: "polite" | "assertive" } = {}
    ) => {
      const { politeness = "polite" } = options
      const id =
        politeness === "assertive"
          ? "live-region-assertive"
          : "live-region-polite"

      const element = document.getElementById(id)
      if (!element) return

      // Clear and re-set to trigger screen reader announcement
      element.textContent = ""

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        element.textContent = message
      }, 100)
    },
    []
  )

  return announce
}
