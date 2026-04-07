import type { PiiRedactorConfig, PiiRedactorResult, PiiType } from "../types"

/** Regex patterns for common PII types */
const PII_PATTERNS: Record<PiiType, RegExp> = {
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  phone: /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
  ssn: /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/g,
  credit_card: /\b(?:\d{4}[-.\s]?){3}\d{4}\b/g,
  ip_address: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
}

const DEFAULT_CONFIG: PiiRedactorConfig = {
  types: ["email", "phone", "ssn", "credit_card"],
  replacement: "[REDACTED]",
}

/**
 * Detects and redacts PII (Personally Identifiable Information) from text.
 * Uses regex patterns for common PII types.
 */
export function redactPii(
  text: string,
  config: Partial<PiiRedactorConfig> = {}
): PiiRedactorResult {
  const { types, replacement } = { ...DEFAULT_CONFIG, ...config }
  let redacted = text
  let detectedCount = 0
  const detectedTypes: PiiType[] = []

  for (const type of types) {
    const pattern = PII_PATTERNS[type]
    if (!pattern) continue

    // Reset regex state for global patterns
    const regex = new RegExp(pattern.source, pattern.flags)
    const matches = redacted.match(regex)

    if (matches) {
      detectedCount += matches.length
      if (!detectedTypes.includes(type)) {
        detectedTypes.push(type)
      }
      redacted = redacted.replace(regex, replacement ?? "[REDACTED]")
    }
  }

  return {
    redacted,
    detectedCount,
    detectedTypes,
  }
}
