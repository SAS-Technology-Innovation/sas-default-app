import type { TokenBudgetConfig, TokenBudgetResult } from "../types"

const DEFAULT_CONFIG: TokenBudgetConfig = {
  maxTokensPerRequest: 4_096,
  maxTokensPerUserPerHour: 100_000,
}

interface UsageEntry {
  tokens: number
  timestamp: number
}

/**
 * Tracks and enforces token budgets per user.
 * Provides cost estimation and usage tracking for AI API calls.
 */
export class TokenBudget {
  private usage = new Map<string, UsageEntry[]>()
  private config: TokenBudgetConfig

  constructor(config: Partial<TokenBudgetConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * Rough estimate: ~4 chars per token for English text.
   * For more accurate estimates, use a proper tokenizer.
   */
  estimateTokens(text: string): number {
    return Math.ceil(text.length / 4)
  }

  check(userId: string, inputText: string): TokenBudgetResult {
    const estimatedTokens = this.estimateTokens(inputText)
    const now = Date.now()
    const oneHourAgo = now - 3_600_000

    // Get recent usage
    let entries = this.usage.get(userId) ?? []
    entries = entries.filter((e) => e.timestamp > oneHourAgo)
    this.usage.set(userId, entries)

    const usedTokens = entries.reduce((sum, e) => sum + e.tokens, 0)
    const remainingBudget = this.config.maxTokensPerUserPerHour - usedTokens

    // Check per-request limit
    if (estimatedTokens > this.config.maxTokensPerRequest) {
      return { allowed: false, estimatedTokens, remainingBudget }
    }

    // Check hourly budget
    if (estimatedTokens > remainingBudget) {
      return { allowed: false, estimatedTokens, remainingBudget }
    }

    return { allowed: true, estimatedTokens, remainingBudget }
  }

  /** Record actual token usage after an API call */
  record(userId: string, tokens: number): void {
    const entries = this.usage.get(userId) ?? []
    entries.push({ tokens, timestamp: Date.now() })
    this.usage.set(userId, entries)
  }

  /** Remove all tracked entries (useful for testing) */
  reset(): void {
    this.usage.clear()
  }
}
