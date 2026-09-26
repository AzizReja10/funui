export const KEY_ORDER = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");

export const BASKET = Object.fromEntries(
  KEY_ORDER.map((letter, i) => {
    const t = i / (KEY_ORDER.length - 1);
    const angle = -70 + t * 140;
    return [letter, angle];
  })
);

export const MAX_CHARS = 42;
export const STEP_PX = 8.6;
export const MARGIN_WARN_AT = MAX_CHARS - 6;
