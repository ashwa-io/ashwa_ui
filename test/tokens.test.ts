import { readFileSync } from 'node:fs';

import {
  converter,
  modeLrgb,
  modeOklab,
  modeOklch,
  modeRgb,
  parse,
  useMode as registerMode,
  wcagContrast,
} from 'culori/fn';
import { describe, expect, it } from 'vitest';

import { brandTheme, DEFAULT_BRAND_HEX } from '../src/theme/brandTheme';

const css = readFileSync('src/styles/index.css', 'utf8');

const block = (selector: string): Record<string, string> => {
  const match = new RegExp(`^${selector}\\s*\\{([\\s\\S]*?)^\\}`, 'm').exec(css);
  if (!match) throw new Error(`no ${selector} block in index.css`);
  return Object.fromEntries(
    [...match[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(([, name, value]) => [
      name,
      value.trim(),
    ])
  );
};

registerMode(modeRgb);
registerMode(modeLrgb);
registerMode(modeOklab);
registerMode(modeOklch);

// What an sRGB screen paints: out-of-gamut channels are clipped, which lowers real contrast.
const painted = (text: string) => {
  const { r, g, b } = toRgb(parse(text))!;
  const clip = (channel: number) => Math.min(1, Math.max(0, channel));
  return { mode: 'rgb' as const, r: clip(r), g: clip(g), b: clip(b) };
};

const contrast = (a: string, b: string): number => wcagContrast(painted(a), painted(b));

// Fixed text colours (status tones, muted) must be readable on every surface, light and dark.
const TEXT_TOKENS = [
  '--success',
  '--warning',
  '--info',
  '--destructive',
  '--muted-foreground',
  '--brand-text',
];
const TEXT_SURFACES = ['--background', '--card', '--muted', '--accent', '--sidebar'];
const STATUS_TOKENS = ['--success', '--warning', '--info', '--destructive'];
const toRgb = converter('rgb');

// A status colour on its own Badge tint (10% light, 20% dark) composited over a surface.
const tintContrast = (token: string, surface: string, alpha: number): number => {
  const fg = painted(token);
  const bg = painted(surface);
  const mix = (a: number, b: number) => a * alpha + b * (1 - alpha);
  return wcagContrast(fg, {
    mode: 'rgb',
    r: mix(fg.r, bg.r),
    g: mix(fg.g, bg.g),
    b: mix(fg.b, bg.b),
  });
};
const STATUS_COLOURS = ['success', 'warning', 'info'];

const root = block(':root');
const dark = block('\\.dark');
const defaults = brandTheme(DEFAULT_BRAND_HEX);

const BRAND_MAPPINGS = {
  '--primary': 'var(--brand)',
  '--primary-foreground': 'var(--brand-foreground)',
  '--ring': 'var(--brand)',
  '--sidebar-primary': 'var(--brand)',
  '--sidebar-primary-foreground': 'var(--brand-foreground)',
  '--sidebar-ring': 'var(--brand)',
  '--chart-1': 'var(--brand)',
};

const RADIUS_SCALE = [
  '--radius-sm: calc(var(--radius) - 4px)',
  '--radius-md: calc(var(--radius) - 2px)',
  '--radius-lg: var(--radius)',
  '--radius-xl: calc(var(--radius) + 4px)',
  '--radius-2xl: calc(var(--radius) + 8px)',
  '--radius-3xl: calc(var(--radius) + 12px)',
  '--radius-4xl: calc(var(--radius) + 16px)',
];

describe('src/styles/index.css', () => {
  it('brand defaults equal the generator output', () => {
    Object.entries(defaults.light).forEach(([name, value]) => expect(root[name]).toBe(value));
    Object.entries(defaults.dark).forEach(([name, value]) => expect(dark[name]).toBe(value));
  });

  it('surfaces match the generator', () => {
    expect(root['--background']).toBe('oklch(1 0 0)');
    expect(dark['--background']).toBe('oklch(0.141 0.005 285.823)');
    expect(dark['--card']).toBe('oklch(0.21 0.006 285.885)');
  });

  it('neutrals and charts follow the nigam shadcn theme', () => {
    expect(root['--foreground']).toBe('oklch(0.141 0.005 285.823)');
    expect(root['--muted']).toBe('oklch(0.967 0.001 286.375)');
    expect(root['--border']).toBe('oklch(0.92 0.004 286.32)');
    expect(root['--chart-2']).toBe('oklch(0.6 0.118 184.704)');
    expect(dark['--muted']).toBe('oklch(0.274 0.006 286.033)');
    expect(dark['--chart-2']).toBe('oklch(0.696 0.17 162.48)');
    expect(DEFAULT_BRAND_HEX).toBe('#8b4efb');
    expect(dark['--brand-map']).toBe('#7f22fe');
  });

  it('primary, ring, sidebar-primary and chart-1 follow the brand in both modes', () => {
    Object.entries(BRAND_MAPPINGS).forEach(([name, value]) => {
      expect(root[name]).toBe(value);
      expect([undefined, value]).toContain(dark[name]);
    });
  });

  it('exposes brand colours as Tailwind utilities', () => {
    Object.keys(defaults.light)
      .filter(name => name !== '--brand-map')
      .forEach(name => expect(css).toContain(`--color-${name.slice(2)}: var(${name});`));
  });

  it.each(TEXT_TOKENS)('%s reaches 4.5:1 on every text surface in both modes', token => {
    [root, { ...root, ...dark }].forEach(mode =>
      TEXT_SURFACES.forEach(surface =>
        expect(contrast(mode[token], mode[surface])).toBeGreaterThanOrEqual(4.5)
      )
    );
  });

  it.each(['--muted-foreground', ...STATUS_TOKENS])('%s reaches 4.5:1 on the brand tint', token => {
    [root, { ...root, ...dark }].forEach(mode =>
      expect(contrast(mode[token], mode['--brand-tint'])).toBeGreaterThanOrEqual(4.5)
    );
  });

  it.each(STATUS_TOKENS)('%s Badge tint reaches 4.5:1 on every org brand tint', token => {
    ['#ffffff', '#000000', '#ffff00', '#ff0000', '#000080', '#8b5cf6', '#1a73e8'].forEach(hex => {
      const theme = brandTheme(hex);
      expect(tintContrast(root[token], theme.light['--brand-tint'], 0.1)).toBeGreaterThanOrEqual(
        4.5
      );
      expect(tintContrast(dark[token], theme.dark['--brand-tint'], 0.2)).toBeGreaterThanOrEqual(
        4.5
      );
    });
  });

  it.each(STATUS_TOKENS)('%s Badge tint reaches 4.5:1 on muted and the brand tint', token => {
    [
      { mode: root, alpha: 0.1 },
      { mode: { ...root, ...dark }, alpha: 0.2 },
    ].forEach(({ mode, alpha }) =>
      ['--muted', '--brand-tint'].forEach(surface =>
        expect(tintContrast(mode[token], mode[surface], alpha)).toBeGreaterThanOrEqual(4.5)
      )
    );
  });

  it('exposes status colours as Tailwind utilities', () => {
    STATUS_COLOURS.forEach(name => expect(css).toContain(`--color-${name}: var(--${name});`));
  });

  it('radius matches nigam', () => {
    expect(root['--radius']).toBe('0.5rem');
    RADIUS_SCALE.forEach(declaration => expect(css).toContain(`${declaration};`));
  });

  it('imports tailwind, shadcn variants, animations and Inter, and sources dist', () => {
    expect(css).toContain("@import 'tailwindcss';");
    expect(css).toContain("@import './shadcn.css';");
    expect(css).toContain("@import 'tw-animate-css';");
    expect(css).toContain("@import '@fontsource-variable/inter';");
    expect(css).toContain("@source '../../dist';");
  });
});
