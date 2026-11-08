import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

interface Swatch {
  name: string;
  className: string;
}

// Literal class names so Tailwind generates them.
const COLOR_SWATCHES: Swatch[] = [
  { name: 'background', className: 'bg-background' },
  { name: 'card', className: 'bg-card' },
  { name: 'primary', className: 'bg-primary' },
  { name: 'brand', className: 'bg-brand' },
  { name: 'brand-tint', className: 'bg-brand-tint' },
  { name: 'secondary', className: 'bg-secondary' },
  { name: 'muted', className: 'bg-muted' },
  { name: 'accent', className: 'bg-accent' },
  { name: 'destructive', className: 'bg-destructive' },
  { name: 'border', className: 'bg-border' },
];

const RADIUS_SWATCHES: Swatch[] = [
  { name: 'sm · 4px', className: 'rounded-sm' },
  { name: 'md · 6px', className: 'rounded-md' },
  { name: 'lg · 8px', className: 'rounded-lg' },
  { name: 'xl · 12px', className: 'rounded-xl' },
  { name: '2xl · 16px', className: 'rounded-2xl' },
  { name: '3xl · 20px', className: 'rounded-3xl' },
  { name: '4xl · 24px', className: 'rounded-4xl' },
];

const Tokens: React.FC = () => (
  <div className="flex flex-col gap-8 p-6">
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">Colours</h2>
      <ul className="grid grid-cols-5 gap-4">
        {COLOR_SWATCHES.map(swatch => (
          <li key={swatch.name} className="flex flex-col gap-1.5" data-testid="swatch">
            <div className={`${swatch.className} h-14 rounded-lg border`} />
            <span className="text-muted-foreground text-xs">{swatch.name}</span>
          </li>
        ))}
      </ul>
      <p className="text-brand-text text-sm font-medium">brand-text on background</p>
      <p className="bg-brand-tint text-brand-tint-foreground rounded-md px-3 py-2 text-sm">
        brand-tint-foreground on brand-tint
      </p>
    </section>
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">Radius</h2>
      <ul className="flex flex-wrap gap-4">
        {RADIUS_SWATCHES.map(swatch => (
          <li key={swatch.name} className="flex flex-col items-center gap-1.5" data-testid="swatch">
            <div className={`${swatch.className} bg-muted size-16 border`} />
            <span className="text-muted-foreground text-xs">{swatch.name}</span>
          </li>
        ))}
      </ul>
    </section>
  </div>
);

const meta: Meta<typeof Tokens> = {
  title: 'Foundations/Tokens',
  component: Tokens,
  parameters: { layout: 'fullscreen' },
};

export default meta;

export const All: StoryObj<typeof Tokens> = {
  play: async ({ canvasElement }) => {
    const swatches = within(canvasElement).getAllByTestId('swatch');
    await expect(swatches).toHaveLength(COLOR_SWATCHES.length + RADIUS_SWATCHES.length);
    for (const swatch of swatches) await expect(swatch).toBeVisible();
  },
};
