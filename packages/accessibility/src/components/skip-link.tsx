"use client"

/**
 * Skip to main content link for keyboard navigation.
 * Visually hidden until focused, then appears at the top of the page.
 */
export function SkipLink({ href = "#main-content" }: { href?: string }) {
  return (
    <a
      href={href}
      style={{
        position: "absolute",
        left: "-10000px",
        top: "auto",
        width: "1px",
        height: "1px",
        overflow: "hidden",
      }}
      onFocus={(e) => {
        const el = e.currentTarget
        el.style.position = "fixed"
        el.style.left = "8px"
        el.style.top = "8px"
        el.style.width = "auto"
        el.style.height = "auto"
        el.style.overflow = "visible"
        el.style.zIndex = "9999"
        el.style.padding = "8px 16px"
        el.style.background = "var(--background, #fff)"
        el.style.color = "var(--foreground, #000)"
        el.style.border = "2px solid var(--ring, #000)"
        el.style.borderRadius = "4px"
        el.style.fontSize = "14px"
        el.style.fontWeight = "600"
      }}
      onBlur={(e) => {
        const el = e.currentTarget
        el.style.position = "absolute"
        el.style.left = "-10000px"
        el.style.width = "1px"
        el.style.height = "1px"
        el.style.overflow = "hidden"
      }}
    >
      Skip to main content
    </a>
  )
}
