import { describe, it, expect } from "vitest"
import { redactPii } from "../moderation/pii-redactor"

describe("redactPii", () => {
  it("redacts email addresses", () => {
    const result = redactPii("Contact me at user@example.com please")
    expect(result.redacted).toBe("Contact me at [REDACTED] please")
    expect(result.detectedCount).toBe(1)
    expect(result.detectedTypes).toContain("email")
  })

  it("redacts phone numbers", () => {
    const result = redactPii("Call me at 555-123-4567")
    expect(result.redacted).toBe("Call me at [REDACTED]")
    expect(result.detectedTypes).toContain("phone")
  })

  it("redacts SSNs", () => {
    const result = redactPii("SSN: 123-45-6789")
    expect(result.redacted).toBe("SSN: [REDACTED]")
    expect(result.detectedTypes).toContain("ssn")
  })

  it("redacts credit card numbers", () => {
    const result = redactPii("Card: 4111-1111-1111-1111")
    expect(result.redacted).toBe("Card: [REDACTED]")
    expect(result.detectedTypes).toContain("credit_card")
  })

  it("redacts multiple PII types in one string", () => {
    const result = redactPii("Email: user@test.com, Phone: 555-123-4567")
    expect(result.detectedCount).toBe(2)
    expect(result.detectedTypes).toContain("email")
    expect(result.detectedTypes).toContain("phone")
  })

  it("uses custom replacement text", () => {
    const result = redactPii("Email: user@test.com", {
      replacement: "[PII_REMOVED]",
    })
    expect(result.redacted).toContain("[PII_REMOVED]")
  })

  it("returns original text when no PII found", () => {
    const result = redactPii("Hello, world!")
    expect(result.redacted).toBe("Hello, world!")
    expect(result.detectedCount).toBe(0)
    expect(result.detectedTypes).toHaveLength(0)
  })
})
