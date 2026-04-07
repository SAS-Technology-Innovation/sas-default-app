import type { SanitizeConfig, SanitizeResult } from "../types"

const DEFAULT_CONFIG: SanitizeConfig = {
  maxLength: 10_000,
  sensitivity: "medium",
}

/** Common prompt injection patterns by sensitivity level */
const INJECTION_PATTERNS: Record<string, { pattern: RegExp; level: string }[]> =
  {
    low: [
      {
        pattern: /ignore\s+(all\s+)?previous\s+instructions/i,
        level: "injection",
      },
      { pattern: /you\s+are\s+now\s+/i, level: "role_override" },
      {
        pattern: /system\s*prompt\s*[:=]/i,
        level: "system_prompt_leak",
      },
    ],
    medium: [
      { pattern: /\bdo\s+not\s+follow\b/i, level: "injection" },
      {
        pattern: /\bdisregard\b.*\b(instructions|rules|guidelines)\b/i,
        level: "injection",
      },
      {
        pattern: /\boverride\b.*\b(safety|filter|restriction)\b/i,
        level: "override",
      },
      { pattern: /\bact\s+as\b/i, level: "role_override" },
      {
        pattern: /\brepeat\b.*\b(system|initial)\s*(prompt|message)\b/i,
        level: "system_prompt_leak",
      },
    ],
    high: [
      { pattern: /\bpretend\b/i, level: "role_override" },
      { pattern: /\broleplay\b/i, level: "role_override" },
      { pattern: /\bjailbreak\b/i, level: "injection" },
      { pattern: /\bDAN\b/, level: "injection" },
      {
        pattern: /\b(reveal|show|display)\b.*\b(instructions|prompt)\b/i,
        level: "system_prompt_leak",
      },
    ],
  }

/**
 * Detects and sanitizes potential prompt injection attacks.
 * Uses configurable sensitivity levels and pattern matching.
 */
export function sanitizeInput(
  input: string,
  config: Partial<SanitizeConfig> = {}
): SanitizeResult {
  const { maxLength, sensitivity } = { ...DEFAULT_CONFIG, ...config }
  const flags: string[] = []

  // Length check
  if (input.length > maxLength) {
    flags.push("input_too_long")
    input = input.slice(0, maxLength)
  }

  // Normalize unicode characters that could bypass pattern detection
  let sanitized = input.normalize("NFKC")

  // Check patterns based on sensitivity level
  const levels: string[] = []
  if (
    sensitivity === "low" ||
    sensitivity === "medium" ||
    sensitivity === "high"
  ) {
    levels.push("low")
  }
  if (sensitivity === "medium" || sensitivity === "high") {
    levels.push("medium")
  }
  if (sensitivity === "high") {
    levels.push("high")
  }

  for (const level of levels) {
    const patterns = INJECTION_PATTERNS[level]
    if (!patterns) continue
    for (const { pattern, level: flagType } of patterns) {
      if (pattern.test(sanitized)) {
        flags.push(flagType)
      }
    }
  }

  return {
    safe: flags.length === 0,
    sanitized,
    flags: [...new Set(flags)],
  }
}
