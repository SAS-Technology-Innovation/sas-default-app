/**
 * Focus management utilities for accessible interactive patterns.
 */

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ")

/** Get all focusable elements within a container */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
}

/** Move focus to the first focusable element in a container */
export function focusFirst(container: HTMLElement): void {
  const elements = getFocusableElements(container)
  elements[0]?.focus()
}

/** Move focus to the last focusable element in a container */
export function focusLast(container: HTMLElement): void {
  const elements = getFocusableElements(container)
  elements[elements.length - 1]?.focus()
}

/** Restore focus to a previously focused element */
export function createFocusRestorer(): {
  save: () => void
  restore: () => void
} {
  let previouslyFocused: HTMLElement | null = null

  return {
    save() {
      previouslyFocused = document.activeElement as HTMLElement | null
    },
    restore() {
      previouslyFocused?.focus()
      previouslyFocused = null
    },
  }
}
