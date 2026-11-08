import {
  clampChroma,
  converter,
  formatHex,
  modeLrgb,
  modeOklab,
  modeOklch,
  modeRgb,
  parseHex,
  useMode as registerMode,
  wcagContrast,
  type Oklch,
} from 'culori/fn';

// culori/fn is tree-shaken: register only the colour spaces this file converts through.
registerMode(modeRgb);
registerMode(modeLrgb);
registerMode(modeOklab);
registerMode(modeOklch);

// Today's button violet: oklch(0.585 0.233 293) from src/index.css.
export const DEFAULT_BRAND_HEX = '#8750f6';

export type BrandWarning = 'adjusted' | 'near-destructive' | 'invalid';

type BrandMode = 'light' | 'dark';

export interface BrandTokens {
  '--brand': string;
  '--brand-foreground': string;
  '--brand-text': string;
  '--brand-tint': string;
  '--brand-tint-foreground': string;
  '--brand-map': string;
}

export interface BrandTheme {
  light: BrandTokens;
  dark: BrandTokens;
  warnings: BrandWarning[];
}

// Must match --background / --card in src/styles/index.css (shadcn base-nova neutral).
// Every rule must hold on each surface brand colour can sit on.
const SURFACES: Record<BrandMode, Oklch[]> = {
  light: [{ mode: 'oklch', l: 1, c: 0 }],
  dark: [
    { mode: 'oklch', l: 0.145, c: 0 },
    { mode: 'oklch', l: 0.205, c: 0 },
  ],
};
// Light mode searches toward black, dark mode toward white.
const DIRECTION: Record<BrandMode, 1 | -1> = { light: -1, dark: 1 };
const TINT: Record<BrandMode, { l: number; chromaScale: number; maxChroma: number }> = {
  light: { l: 0.965, chromaScale: 0.15, maxChroma: 0.03 },
  dark: { l: 0.3, chromaScale: 0.2, maxChroma: 0.04 },
};
const WHITE: Oklch = { mode: 'oklch', l: 1, c: 0 };
const BLACK: Oklch = { mode: 'oklch', l: 0, c: 0 };

const MIN_UI_CONTRAST = 3; // WCAG 1.4.11 non-text contrast
const MIN_TEXT_CONTRAST = 4.5; // WCAG 1.4.3 text contrast
const LIGHTNESS_STEP = 0.005;
const MAX_STEPS = 200; // 200 × 0.005 covers the full lightness range
const WHITE_LABEL_MAX_STEPS = 10; // darken the brand by at most 0.05 L to keep a white label
const DESTRUCTIVE_HUE = 27;
const NEAR_DESTRUCTIVE_HUE_RANGE = 20;
const NEAR_DESTRUCTIVE_MIN_CHROMA = 0.1;
const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;

const toOklch = converter('oklch');

// Clamp into sRGB and round to the precision we emit, so contrast is checked on the
// exact value the browser will paint (chroma floors to stay inside the gamut).
const settle = (color: Oklch): Oklch => {
  const clamped = clampChroma(color, 'oklch');
  return {
    mode: 'oklch',
    l: Math.round(clamped.l * 1000) / 1000,
    c: Math.floor(clamped.c * 1000) / 1000,
    h: clamped.h === undefined ? undefined : Math.round(clamped.h * 10) / 10,
  };
};

const stepUntil = (
  start: Oklch,
  direction: 1 | -1,
  passes: (color: Oklch) => boolean,
  maxSteps = MAX_STEPS
): Oklch => {
  let l = start.l;
  let color = settle(start);
  for (let step = 0; step < maxSteps && !passes(color); step += 1) {
    l = Math.min(1, Math.max(0, l + direction * LIGHTNESS_STEP));
    color = settle({ ...start, l });
  }
  return color;
};

const minContrast = (color: Oklch, surfaces: Oklch[]): number =>
  Math.min(...surfaces.map(surface => wcagContrast(color, surface)));

const formatOklch = (color: Oklch): string =>
  `oklch(${color.l.toFixed(3)} ${color.c.toFixed(3)} ${(color.h ?? 0).toFixed(1)})`;

// White is how brand buttons usually read: darken the brand slightly if that is all it
// takes for a white label, otherwise keep the brand and use black.
const withLabel = (brand: Oklch, surfaces: Oklch[]): { brand: Oklch; label: Oklch } => {
  const whitePasses = (c: Oklch) => wcagContrast(WHITE, c) >= MIN_TEXT_CONTRAST;
  const darker = stepUntil(brand, -1, whitePasses, WHITE_LABEL_MAX_STEPS);
  if (whitePasses(darker) && minContrast(darker, surfaces) >= MIN_UI_CONTRAST) {
    return { brand: darker, label: WHITE };
  }
  return { brand, label: BLACK };
};

const isNearDestructive = (input: Oklch): boolean => {
  if (input.h === undefined || input.c < NEAR_DESTRUCTIVE_MIN_CHROMA) return false;
  const hueDistance = Math.abs(((input.h - DESTRUCTIVE_HUE + 540) % 360) - 180);
  return hueDistance <= NEAR_DESTRUCTIVE_HUE_RANGE;
};

const modeTokens = (input: Oklch, mode: BrandMode): BrandTokens => {
  const surfaces = SURFACES[mode];
  const direction = DIRECTION[mode];
  const tintSpec = TINT[mode];

  const { brand, label } = withLabel(
    stepUntil(input, direction, c => minContrast(c, surfaces) >= MIN_UI_CONTRAST),
    surfaces
  );
  const text = stepUntil(brand, direction, c => minContrast(c, surfaces) >= MIN_TEXT_CONTRAST);
  const tint = settle({
    mode: 'oklch',
    l: tintSpec.l,
    c: Math.min(input.c * tintSpec.chromaScale, tintSpec.maxChroma),
    h: input.h,
  });
  const tintForeground = stepUntil(
    text,
    direction,
    c => wcagContrast(c, tint) >= MIN_TEXT_CONTRAST
  );

  return {
    '--brand': formatOklch(brand),
    '--brand-foreground': formatOklch(label),
    '--brand-text': formatOklch(text),
    '--brand-tint': formatOklch(tint),
    '--brand-tint-foreground': formatOklch(tintForeground),
    '--brand-map': formatHex(brand),
  };
};

const buildTheme = (input: Oklch): BrandTheme => {
  const light = modeTokens(input, 'light');
  const warnings: BrandWarning[] = [];
  if (light['--brand'] !== formatOklch(settle(input))) warnings.push('adjusted');
  if (isNearDestructive(input)) warnings.push('near-destructive');
  return { light, dark: modeTokens(input, 'dark'), warnings };
};

const parseBrand = (hex: string): Oklch | undefined => {
  if (!HEX_PATTERN.test(hex)) return undefined;
  const rgb = parseHex(hex);
  return rgb && toOklch(rgb);
};

/** Brand tokens for light and dark from one org hex. Never throws; bad input → default. */
export const brandTheme = (hex: string | null | undefined): BrandTheme => {
  const input = parseBrand(hex ?? DEFAULT_BRAND_HEX);
  if (input) return buildTheme(input);
  // BLACK is unreachable: DEFAULT_BRAND_HEX always parses.
  const fallback = buildTheme(parseBrand(DEFAULT_BRAND_HEX) ?? BLACK);
  return { ...fallback, warnings: ['invalid'] };
};

const declarations = (tokens: BrandTokens): string =>
  Object.entries(tokens)
    .map(([name, value]) => `${name}:${value};`)
    .join('');

export const brandThemeCss = (hex: string | null | undefined): string => {
  const { light, dark } = brandTheme(hex);
  // Doubled :root outranks the static defaults in index.css whichever stylesheet loads last.
  return `:root:root{${declarations(light)}}:root:root.dark{${declarations(dark)}}`;
};
