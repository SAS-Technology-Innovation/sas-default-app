import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import Page from "../../app/page"

describe("Home page", () => {
  it("renders the heading", () => {
    render(<Page />)
    expect(
      screen.getByRole("heading", { name: /project ready/i })
    ).toBeInTheDocument()
  })

  it("renders a button component", () => {
    render(<Page />)
    const buttons = screen.getAllByRole("button")
    expect(buttons.length).toBeGreaterThan(0)
  })
})
