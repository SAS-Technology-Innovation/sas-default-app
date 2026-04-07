"use client"

import { useState, useEffect } from "react"

/**
 * Detects if the user prefers reduced motion via OS/browser settings.
 * Returns true when `prefers-reduced-motion: reduce` is active.
 */
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReduced(mq.matches)

    function onChange(event: MediaQueryListEvent) {
      setPrefersReduced(event.matches)
    }

    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  return prefersReduced
}
