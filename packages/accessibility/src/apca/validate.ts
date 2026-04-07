import { calcAPCA } from "./contrast"
import { THRESHOLDS, type ThresholdLevel } from "./thresholds"

export interface ContrastValidation {
  lc: number
  absLc: number
  passes: boolean
  threshold: number
  level: ThresholdLevel
}

/**
 * Validate a color pair against an APCA AAA 3.0 threshold.
 *
 * @param textColor - Text color as [r, g, b] or hex string
 * @param bgColor - Background color as [r, g, b] or hex string
 * @param level - Threshold level to validate against (default: "bodyText")
 */
export function validateContrast(
  textColor: [number, number, number] | string,
  bgColor: [number, number, number] | string,
  level: ThresholdLevel = "bodyText"
): ContrastValidation {
  const lc = calcAPCA(textColor, bgColor)
  const absLc = Math.abs(lc)
  const threshold = THRESHOLDS[level]

  return {
    lc,
    absLc,
    passes: absLc >= threshold,
    threshold,
    level,
  }
}

/**
 * Check all threshold levels for a color pair.
 * Returns which levels pass and which fail.
 */
export function validateAllLevels(
  textColor: [number, number, number] | string,
  bgColor: [number, number, number] | string
): Record<ThresholdLevel, ContrastValidation> {
  const levels = Object.keys(THRESHOLDS) as ThresholdLevel[]
  const results = {} as Record<ThresholdLevel, ContrastValidation>

  for (const level of levels) {
    results[level] = validateContrast(textColor, bgColor, level)
  }

  return results
}
