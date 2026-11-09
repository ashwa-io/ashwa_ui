import { converter, parse, wcagContrast } from 'culori';
import { describe, expect, it } from 'vitest';

import { brandTheme, brandThemeCss, DEFAULT_BRAND_HEX, type BrandTokens } from './brandTheme';

// Must match --background / --card in src/styles/index.css (nigam's shadcn zinc).
const SURFACES = {
  light: ['oklch(1 0 0)'],
  dark: ['oklch(0.141 0.005 285.823)', 'oklch(0.21 0.006 285.885)'],
};
// --brand-text must also hold on muted rows.
const MUTED = { light: 'oklch(0.967 0.001 286.375)', dark: 'oklch(0.274 0.006 286.033)' };
const SAMPLES = ['#ffffff', '#000000', '#ffff00', '#ff0000', '#000080', '#8b5cf6', '#1a73e8'];

const ratio = (a: string, b: string): number => {
  const ca = parse(a);
  const cb = parse(b);
  if (!ca || !cb) throw new Error(`unparseable color: ${a} / ${b}`);
  return wcagContrast(ca, cb);
};

const expectContrast = (tokens: BrandTokens, surfaces: string[]) => {
  surfaces.forEach(surface => {
    expect(ratio(tokens['--brand'], surface)).toBeGreaterThanOrEqual(3);
    expect(ratio(tokens['--brand-text'], surface)).toBeGreaterThanOrEqual(4.5);
  });
  expect(ratio(tokens['--brand-foreground'], tokens['--brand'])).toBeGreaterThanOrEqual(4.5);
  expect(ratio(tokens['--brand-tint-foreground'], tokens['--brand-tint'])).toBeGreaterThanOrEqual(
    4.5
  );
};

const toOklch = converter('oklch');

describe('brandTheme', () => {
  it.each(SAMPLES)(
    '%s light: brand ≥3 on bg, foreground ≥4.5 on brand, text ≥4.5 on bg, tint-fg ≥4.5 on tint',
    hex => {
      expectContrast(brandTheme(hex).light, SURFACES.light);
    }
  );

  it.each(SAMPLES)(
    '%s dark: brand ≥3 on bg, foreground ≥4.5 on brand, text ≥4.5 on bg, tint-fg ≥4.5 on tint',
    hex => {
      expectContrast(brandTheme(hex).dark, SURFACES.dark);
    }
  );

  it.each(SAMPLES)('%s brand-map is lowercase #rrggbb in both modes', hex => {
    const theme = brandTheme(hex);
    expect(theme.light['--brand-map']).toMatch(/^#[0-9a-f]{6}$/);
    expect(theme.dark['--brand-map']).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('#ffffff is adjusted', () => {
    expect(brandTheme('#ffffff').warnings).toContain('adjusted');
  });

  it('#ff0000 is near destructive', () => {
    expect(brandTheme('#ff0000').warnings).toContain('near-destructive');
  });

  it('default brand is not near destructive and has no warnings', () => {
    expect(brandTheme(DEFAULT_BRAND_HEX).warnings).toEqual([]);
  });

  it('darkens a borderline brand slightly to keep a white label', () => {
    const theme = brandTheme('#1a73e8');
    expect(theme.warnings).toContain('adjusted');
    expect(ratio(theme.light['--brand'], '#1a73e8')).toBeLessThan(1.1);
  });

  it('uses a black label when white needs a big shift', () => {
    expect(brandTheme('#ffff00').light['--brand-foreground']).toBe('oklch(0 0 0)');
  });

  it('keeps hue', () => {
    const inputHue = toOklch(parse('#1a73e8'))?.h ?? Number.NaN;
    const brandHue = toOklch(parse(brandTheme('#1a73e8').light['--brand']))?.h ?? Number.NaN;
    expect(Math.abs(brandHue - inputHue)).toBeLessThanOrEqual(1);
  });

  it('invalid input falls back to default', () => {
    const fallback = brandTheme(DEFAULT_BRAND_HEX);
    const invalid = brandTheme('nope');
    expect(invalid.light).toEqual(fallback.light);
    expect(invalid.dark).toEqual(fallback.dark);
    expect(invalid.warnings).toEqual(['invalid']);
    expect(brandTheme('#fff').warnings).toEqual(['invalid']);
  });

  it('prefers white foreground whenever white passes 4.5', () => {
    expect(brandTheme('#1a73e8').light['--brand-foreground']).toBe('oklch(1 0 0)');
  });

  it('default brand keeps white foreground like today', () => {
    expect(brandTheme(null).light['--brand-foreground']).toBe('oklch(1 0 0)');
  });

  it('only the default goes a shade deeper in dark mode, like nigam', () => {
    expect(brandTheme(null).dark['--brand']).toBe('oklch(0.54 0.281 292.9)');
    expect(brandTheme('#8e51ff').dark['--brand']).toBe(brandTheme('#8e51ff').light['--brand']);
  });

  it('null falls back to default without warning', () => {
    expect(brandTheme(null)).toEqual(brandTheme(DEFAULT_BRAND_HEX));
  });
});

describe('brandThemeCss', () => {
  it('emits both modes with doubled :root selectors', () => {
    const css = brandThemeCss('#1a73e8');
    expect(css.startsWith(':root:root{')).toBe(true);
    expect(css).toContain(':root:root.dark{');
    expect(css).toContain('--brand-text:');
    expect(css).toContain('--brand-map:#');
    expect(css).not.toContain('undefined');
  });
});

describe('--brand-text on muted rows', () => {
  it.each(SAMPLES)('%s reaches 4.5:1 on muted in both modes', hex => {
    const theme = brandTheme(hex);
    expect(ratio(theme.light['--brand-text'], MUTED.light)).toBeGreaterThanOrEqual(4.5);
    expect(ratio(theme.dark['--brand-text'], MUTED.dark)).toBeGreaterThanOrEqual(4.5);
  });
});
