import { describe, it, expect } from "vitest"
import { calcAPCA, hexToRgb, luminance } from "../apca/contrast"
import { validateContrast, validateAllLevels } from "../apca/validate"

describe("hexToRgb", () => {
  it("converts 6-digit hex", () => {
    expect(hexToRgb("#ffffff")).toEqual([255, 255, 255])
    expect(hexToRgb("#000000")).toEqual([0, 0, 0])
    expect(hexToRgb("#ff0000")).toEqual([255, 0, 0])
  })

  it("converts 3-digit hex", () => {
    expect(hexToRgb("#fff")).toEqual([255, 255, 255])
    expect(hexToRgb("#000")).toEqual([0, 0, 0])
  })

  it("handles hex without #", () => {
    expect(hexToRgb("ffffff")).toEqual([255, 255, 255])
  })
})

describe("luminance", () => {
  it("returns 1 for white", () => {
    expect(luminance(255, 255, 255)).toBeCloseTo(1.0, 2)
  })

  it("returns 0 for black", () => {
    expect(luminance(0, 0, 0)).toBeCloseTo(0.0, 2)
  })
})

describe("calcAPCA", () => {
  it("returns high contrast for black text on white background", () => {
    const lc = calcAPCA("#000000", "#ffffff")
    // Should be a large positive value (dark on light)
    expect(lc).toBeGreaterThan(100)
  })

  it("returns negative contrast for white text on black background", () => {
    const lc = calcAPCA("#ffffff", "#000000")
    // Should be a large negative value (light on dark)
    expect(lc).toBeLessThan(-100)
  })

  it("returns 0 for identical colors", () => {
    const lc = calcAPCA("#808080", "#808080")
    expect(lc).toBe(0)
  })

  it("accepts RGB tuples", () => {
    const lc = calcAPCA([0, 0, 0], [255, 255, 255])
    expect(lc).toBeGreaterThan(100)
  })

  it("gives lower contrast for similar colors", () => {
    const lc = calcAPCA("#666666", "#888888")
    expect(Math.abs(lc)).toBeLessThan(30)
  })
})

describe("validateContrast", () => {
  it("passes body text threshold for black on white", () => {
    const result = validateContrast("#000000", "#ffffff", "bodyText")
    expect(result.passes).toBe(true)
    expect(result.absLc).toBeGreaterThanOrEqual(90)
  })

  it("fails body text threshold for low contrast pair", () => {
    const result = validateContrast("#999999", "#aaaaaa", "bodyText")
    expect(result.passes).toBe(false)
  })
})

describe("validateAllLevels", () => {
  it("returns results for all threshold levels", () => {
    const results = validateAllLevels("#000000", "#ffffff")
    expect(results.bodyText.passes).toBe(true)
    expect(results.largeText.passes).toBe(true)
    expect(results.nonText.passes).toBe(true)
    expect(results.decorative.passes).toBe(true)
  })
})
