"use client"

import { useEffect, useRef, type RefObject } from "react"

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ")

/**
 * Traps focus within a container element.
 * Useful for modals, dialogs, and other overlay components.
 *
 * @param active - Whether the trap is active (default: true)
 * @returns Ref to attach to the container element
 */
export function useFocusTrap<T extends HTMLElement>(
  active = true
): RefObject<T | null> {
  const containerRef = useRef<T>(null)

  useEffect(() => {
    if (!active) return

    const container = containerRef.current
    if (!container) return

    function getFocusableElements() {
      return Array.from(
        container!.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      )
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab") return

      const focusable = getFocusableElements()
      if (focusable.length === 0) return

      const first = focusable[0]!
      const last = focusable[focusable.length - 1]!

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    container.addEventListener("keydown", handleKeyDown)
    return () => container.removeEventListener("keydown", handleKeyDown)
  }, [active])

  return containerRef
}
