/**
 * Renders content that is visually hidden but accessible to screen readers.
 * Use for providing additional context that's only needed by assistive technology.
 */
export function VisuallyHidden({
  children,
  as: Tag = "span",
}: {
  children: React.ReactNode
  as?: "span" | "div" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}) {
  return (
    <Tag
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: 0,
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        borderWidth: 0,
      }}
    >
      {children}
    </Tag>
  )
}
