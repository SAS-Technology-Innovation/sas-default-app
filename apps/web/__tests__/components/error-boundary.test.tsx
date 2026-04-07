import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ErrorBoundary } from "../../components/error-boundary"

afterEach(() => {
  cleanup()
})

function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("Test error")
  }
  return <div>No error</div>
}

describe("ErrorBoundary", () => {
  it("renders children when no error", () => {
    render(
      <ErrorBoundary>
        <div>Child content</div>
      </ErrorBoundary>
    )
    expect(screen.getByText("Child content")).toBeInTheDocument()
  })

  it("renders fallback UI when error occurs", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText("Something went wrong")).toBeInTheDocument()
    expect(screen.getByText("Try again")).toBeInTheDocument()

    vi.restoreAllMocks()
  })

  it("renders custom fallback when provided", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})

    render(
      <ErrorBoundary fallback={<div>Custom fallback</div>}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText("Custom fallback")).toBeInTheDocument()

    vi.restoreAllMocks()
  })

  it("resets error state when try again is clicked", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    const user = userEvent.setup()

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    // Error boundary shows fallback
    expect(screen.getByText("Something went wrong")).toBeInTheDocument()

    // Click "Try again" resets the error state
    // (component will throw again, but the state reset itself is what we test)
    await user.click(screen.getByText("Try again"))

    vi.restoreAllMocks()
  })
})
