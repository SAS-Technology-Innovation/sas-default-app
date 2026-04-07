"use client"

import { useEffect } from "react"
import { Button } from "@workspace/ui/components/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Root error boundary caught:", error)
  }, [error])

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="max-w-md space-y-4 text-center">
        <h2 className="text-2xl font-semibold">Something went wrong</h2>
        <p className="text-sm text-muted-foreground">
          An unexpected error occurred. Please try again.
        </p>
        {error.digest && (
          <p className="font-mono text-xs text-muted-foreground">
            Error ID: {error.digest}
          </p>
        )}
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  )
}
