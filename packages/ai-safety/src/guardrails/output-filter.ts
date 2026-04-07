import type { OutputFilterConfig, OutputFilterResult } from "../types"

const DEFAULT_BLOCKLIST: RegExp[] = [
  // API keys and tokens
  /(?:api[_-]?key|token|secret|password)\s*[:=]\s*["']?[a-zA-Z0-9_\-]{20,}/gi,
  // AWS-style keys
  /AKIA[0-9A-Z]{16}/g,
  // Generic secrets that look like base64
  /(?:secret|private[_-]?key)\s*[:=]\s*["']?[A-Za-z0-9+/=]{32,}/gi,
]

const DEFAULT_CONFIG: OutputFilterConfig = {
  blocklist: DEFAULT_BLOCKLIST,
  maxLength: 50_000,
}

/**
 * Filters AI-generated output to remove sensitive patterns.
 * Applies regex-based blocklist matching and length truncation.
 */
export function filterOutput(
  output: string,
  config: Partial<OutputFilterConfig> = {}
): OutputFilterResult {
  const { blocklist, maxLength } = { ...DEFAULT_CONFIG, ...config }
  let filtered = output
  let redactedCount = 0

  for (const pattern of blocklist) {
    const matches = filtered.match(pattern)
    if (matches) {
      redactedCount += matches.length
      filtered = filtered.replace(pattern, "[REDACTED]")
    }
  }

  if (filtered.length > maxLength) {
    filtered = filtered.slice(0, maxLength)
    redactedCount++
  }

  return {
    filtered,
    redactedCount,
  }
}
