import { describe, it, expect, beforeEach } from "vitest"
import { RateLimiter } from "../guardrails/rate-limiter"

describe("RateLimiter", () => {
  let limiter: RateLimiter

  beforeEach(() => {
    limiter = new RateLimiter({ maxRequests: 3, windowMs: 1000 })
  })

  it("allows requests within the limit", () => {
    const result = limiter.check("user1")
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(2)
  })

  it("blocks requests exceeding the limit", () => {
    limiter.check("user1")
    limiter.check("user1")
    limiter.check("user1")

    const result = limiter.check("user1")
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it("tracks limits independently per key", () => {
    limiter.check("user1")
    limiter.check("user1")
    limiter.check("user1")

    const result = limiter.check("user2")
    expect(result.allowed).toBe(true)
  })

  it("resets all entries", () => {
    limiter.check("user1")
    limiter.check("user1")
    limiter.check("user1")

    limiter.reset()

    const result = limiter.check("user1")
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(2)
  })
})
