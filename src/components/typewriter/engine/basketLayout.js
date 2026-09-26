export const KEY_ORDER = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");

export const BASKET = Object.fromEntries(
  KEY_ORDER.map((letter, i) => {
    const t = i / (KEY_ORDER.length - 1);
    const angle = -70 + t * 140;
    return [letter, angle];
  })
);

export const MAX_CHARS = 48;
export const STEP_PX = 6.2;
export const MARGIN_WARN_AT = 40;

export const MAX_LINE_WIDTH_PX = 348;
export const MARGIN_WARN_WIDTH_PX = 295;

let measureCtx = null;
export function getTextPixelWidth(text, font = "17px 'Roboto', sans-serif") {
  if (typeof document === "undefined") {
    return (text || "").length * 9.2;
  }
  if (!measureCtx) {
    const canvas = document.createElement("canvas");
    measureCtx = canvas.getContext("2d");
  }
  if (!measureCtx) {
    return (text || "").length * 9.2;
  }
  measureCtx.font = font;
  return measureCtx.measureText(text || "").width;
}
