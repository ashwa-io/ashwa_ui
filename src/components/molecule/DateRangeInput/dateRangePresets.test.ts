import { describe, expect, it } from 'vitest';

import { DEFAULT_DATE_RANGE_PRESETS, dateRangePresets } from './dateRangePresets';

const ranges = (today: string) =>
  Object.fromEntries(dateRangePresets(() => today).map(preset => [preset.label, preset.range()]));

describe('dateRangePresets', () => {
  it('counts every preset from the given today', () => {
    expect(ranges('2026-11-10')).toEqual({
      Today: { from: '2026-11-10', to: '2026-11-10' },
      Yesterday: { from: '2026-11-09', to: '2026-11-09' },
      'Last 7 days': { from: '2026-11-04', to: '2026-11-10' },
      'Last 30 days': { from: '2026-10-12', to: '2026-11-10' },
      'This month': { from: '2026-11-01', to: '2026-11-10' },
      'Last month': { from: '2026-10-01', to: '2026-10-31' },
    });
  });

  it('crosses month, year and leap-day edges', () => {
    expect(ranges('2026-01-01')).toMatchObject({
      Yesterday: { from: '2025-12-31', to: '2025-12-31' },
      'Last month': { from: '2025-12-01', to: '2025-12-31' },
    });
    expect(ranges('2028-03-31')['Last month']).toEqual({ from: '2028-02-01', to: '2028-02-29' });
  });

  it('asks for today on every call, so a page left open follows the clock', () => {
    let today = '2026-11-10';
    const [preset] = dateRangePresets(() => today);
    today = '2026-11-11';
    expect(preset.range().from).toBe('2026-11-11');
  });

  it('defaults to the browser day', () => {
    const now = new Date();
    const local = [now.getFullYear(), now.getMonth() + 1, now.getDate()]
      .map(part => String(part).padStart(2, '0'))
      .join('-');
    expect(DEFAULT_DATE_RANGE_PRESETS[0].range().from).toBe(local);
  });
});
