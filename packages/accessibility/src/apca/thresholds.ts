/**
 * APCA AAA 3.0 threshold constants.
 *
 * Lc (Lightness Contrast) values represent minimum absolute contrast
 * required for different use cases. Polarity-aware: the sign indicates
 * direction but thresholds are compared against absolute values.
 */

/** Body text (14-16px normal weight): Lc >= 90 */
export const BODY_TEXT_THRESHOLD = 90

/** Large text (24px+ or 18px+ bold): Lc >= 75 */
export const LARGE_TEXT_THRESHOLD = 75

/** Non-text elements (icons, borders, focus indicators): Lc >= 60 */
export const NON_TEXT_THRESHOLD = 60

/** Placeholder/disabled text (minimum legibility): Lc >= 45 */
export const PLACEHOLDER_TEXT_THRESHOLD = 45

/** Decorative/non-essential elements: Lc >= 30 */
export const DECORATIVE_THRESHOLD = 30

/** Sub-fluent spot reading (e.g., copyright text): Lc >= 75 */
export const SPOT_TEXT_THRESHOLD = 75

/** Column headers, labels: Lc >= 60 */
export const HEADER_THRESHOLD = 60

export const THRESHOLDS = {
  bodyText: BODY_TEXT_THRESHOLD,
  largeText: LARGE_TEXT_THRESHOLD,
  nonText: NON_TEXT_THRESHOLD,
  placeholderText: PLACEHOLDER_TEXT_THRESHOLD,
  decorative: DECORATIVE_THRESHOLD,
  spotText: SPOT_TEXT_THRESHOLD,
  header: HEADER_THRESHOLD,
} as const

export type ThresholdLevel = keyof typeof THRESHOLDS
