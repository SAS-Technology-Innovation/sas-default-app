import type { RateLimitConfig, RateLimitResult } from "../types"

interface WindowEntry {
  timestamps: number[]
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 60,
  windowMs: 60_000,
}

/**
 * In-memory sliding window rate limiter.
 * Tracks requests per key (user ID, IP, etc.) within a configurable time window.
 */
export class RateLimiter {
  private windows = new Map<string, WindowEntry>()
  private config: RateLimitConfig

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  check(key: string): RateLimitResult {
    const now = Date.now()
    const windowStart = now - this.config.windowMs

    let entry = this.windows.get(key)
    if (!entry) {
      entry = { timestamps: [] }
      this.windows.set(key, entry)
    }

    // Remove timestamps outside the window
    entry.timestamps = entry.timestamps.filter((t) => t > windowStart)

    const remaining = Math.max(
      0,
      this.config.maxRequests - entry.timestamps.length
    )
    const allowed = entry.timestamps.length < this.config.maxRequests

    if (allowed) {
      entry.timestamps.push(now)
    }

    return {
      allowed,
      remaining: allowed ? remaining - 1 : 0,
      resetAt: windowStart + this.config.windowMs,
    }
  }

  /** Remove all tracked entries (useful for testing) */
  reset(): void {
    this.windows.clear()
  }
}
