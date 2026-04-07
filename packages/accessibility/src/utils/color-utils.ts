/**
 * Color space conversion utilities for accessibility calculations.
 */

/** Convert hex color to [r, g, b] tuple (0-255) */
export function hexToRgb(hex: string): [number, number, number] {
  const cleaned = hex.replace("#", "")
  if (cleaned.length === 3) {
    return [
      parseInt(cleaned[0]! + cleaned[0]!, 16),
      parseInt(cleaned[1]! + cleaned[1]!, 16),
      parseInt(cleaned[2]! + cleaned[2]!, 16),
    ]
  }
  return [
    parseInt(cleaned.slice(0, 2), 16),
    parseInt(cleaned.slice(2, 4), 16),
    parseInt(cleaned.slice(4, 6), 16),
  ]
}

/** Convert [r, g, b] (0-255) to hex string */
export function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((c) => Math.round(Math.min(255, Math.max(0, c))))
      .map((c) => c.toString(16).padStart(2, "0"))
      .join("")
  )
}

/** Convert sRGB (0-255) to linear RGB (0-1) */
export function srgbToLinear(channel: number): number {
  const c = channel / 255
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

/** Convert linear RGB (0-1) to sRGB (0-255) */
export function linearToSrgb(linear: number): number {
  const c =
    linear <= 0.0031308
      ? linear * 12.92
      : 1.055 * Math.pow(linear, 1.0 / 2.4) - 0.055
  return Math.round(c * 255)
}
