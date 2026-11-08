import { readFileSync } from 'node:fs';

import { modeOklch, modeRgb, useMode as registerMode, wcagContrast } from 'culori/fn';
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
registerMode(modeOklch);

const contrast = (a: string, b: string): number => wcagContrast(a, b);

// Fixed text colours (status tones, muted) must be readable on every surface, light and dark.
const TEXT_TOKENS = ['--success', '--warning', '--info', '--destructive', '--muted-foreground'];
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
    expect(dark['--background']).toBe('oklch(0.145 0 0)');
    expect(dark['--card']).toBe('oklch(0.205 0 0)');
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

  it.each(TEXT_TOKENS)('%s reaches 4.5:1 on background and card in both modes', token => {
    [root, dark].forEach(mode =>
      ['--background', '--card'].forEach(surface =>
        expect(contrast(mode[token], mode[surface] ?? root[surface])).toBeGreaterThanOrEqual(4.5)
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
