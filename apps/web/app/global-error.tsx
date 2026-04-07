"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div style={{ maxWidth: "28rem", textAlign: "center" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
              Something went wrong
            </h2>
            <p
              style={{
                marginTop: "0.5rem",
                fontSize: "0.875rem",
                color: "#6b7280",
              }}
            >
              A critical error occurred. Please try refreshing the page.
            </p>
            {error.digest && (
              <p
                style={{
                  marginTop: "0.5rem",
                  fontSize: "0.75rem",
                  color: "#9ca3af",
                  fontFamily: "monospace",
                }}
              >
                Error ID: {error.digest}
              </p>
            )}
            <button
              onClick={reset}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                borderRadius: "0.375rem",
                border: "1px solid #d1d5db",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
