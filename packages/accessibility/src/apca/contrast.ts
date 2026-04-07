/**
 * APCA (Advanced Perceptual Contrast Algorithm) implementation.
 * Based on the APCA-W3 specification for WCAG 3.0 contrast assessment.
 *
 * Reference: https://github.com/Myndex/apca-w3
 */

// sRGB coefficients for luminance calculation
const sRco = 0.2126729
const sGco = 0.7151522
const sBco = 0.072175

// APCA constants
const normBG = 0.56
const normTXT = 0.57
const revBG = 0.65
const revTXT = 0.62

// Clamp and scale
const blkThrs = 0.022
const blkClmp = 1.414
const scaleBoW = 1.14
const scaleWoB = 1.14
const loBoWoffset = 0.027
const loWoBoffset = 0.027
const deltaYmin = 0.0005

/** Parse a hex color string to [r, g, b] (0-255) */
export function hexToRgb(hex: string): [number, number, number] {
  const cleaned = hex.replace("#", "")
  if (cleaned.length === 3) {
    const r = parseInt(cleaned[0]! + cleaned[0]!, 16)
    const g = parseInt(cleaned[1]! + cleaned[1]!, 16)
    const b = parseInt(cleaned[2]! + cleaned[2]!, 16)
    return [r, g, b]
  }
  const r = parseInt(cleaned.slice(0, 2), 16)
  const g = parseInt(cleaned.slice(2, 4), 16)
  const b = parseInt(cleaned.slice(4, 6), 16)
  return [r, g, b]
}

/** Convert sRGB channel (0-255) to linearized luminance component */
function sRGBtoLin(channel: number): number {
  const c = channel / 255.0
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

/** Calculate Y (luminance) from sRGB values */
export function luminance(r: number, g: number, b: number): number {
  return sRGBtoLin(r) * sRco + sRGBtoLin(g) * sGco + sRGBtoLin(b) * sBco
}

/** Soft clamp for black levels */
function softClamp(y: number): number {
  return y > blkThrs ? y : y + Math.pow(blkThrs - y, blkClmp)
}

/**
 * Calculate APCA Lightness Contrast (Lc) value.
 *
 * @param textColor - Text color as [r, g, b] (0-255) or hex string
 * @param bgColor - Background color as [r, g, b] (0-255) or hex string
 * @returns Lc value (positive = dark-on-light, negative = light-on-dark)
 *
 * The absolute value indicates contrast magnitude.
 * Higher absolute values = more contrast.
 */
export function calcAPCA(
  textColor: [number, number, number] | string,
  bgColor: [number, number, number] | string
): number {
  const text = typeof textColor === "string" ? hexToRgb(textColor) : textColor
  const bg = typeof bgColor === "string" ? hexToRgb(bgColor) : bgColor

  let txtY = luminance(text[0], text[1], text[2])
  let bgY = luminance(bg[0], bg[1], bg[2])

  // Soft clamp black levels
  txtY = softClamp(txtY)
  bgY = softClamp(bgY)

  // Minimum luminance difference
  if (Math.abs(bgY - txtY) < deltaYmin) {
    return 0.0
  }

  let outputContrast: number

  // Determine polarity: dark-on-light (BoW) vs light-on-dark (WoB)
  if (bgY > txtY) {
    // Dark text on light background (BoW)
    const SAPC = (Math.pow(bgY, normBG) - Math.pow(txtY, normTXT)) * scaleBoW
    outputContrast = SAPC < loBoWoffset ? 0.0 : SAPC - loBoWoffset
  } else {
    // Light text on dark background (WoB)
    const SAPC = (Math.pow(bgY, revBG) - Math.pow(txtY, revTXT)) * scaleWoB
    outputContrast = SAPC > -loWoBoffset ? 0.0 : SAPC + loWoBoffset
  }

  // Scale to Lc value (0-100 range roughly)
  return outputContrast * 100
}
