import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { Text } from '@/components/atomic/Text';

import { Card } from './Card';

const meta = {
  title: 'Atomic/Card',
  component: Card,
  args: { children: <Text size="sm">Card content</Text> },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { 'data-testid': 'card' },
  play: async ({ canvas }) => {
    await expect(getComputedStyle(canvas.getByTestId('card')).paddingLeft).toBe('16px');
    await expect(canvas.queryByRole('button')).toBeNull();
  },
};

export const Paddings: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Card padding="none" data-testid="none">
        None
      </Card>
      <Card padding="sm" data-testid="sm">
        Small
      </Card>
      <Card padding="md" data-testid="md">
        Medium
      </Card>
      <Card padding="lg" data-testid="lg">
        Large
      </Card>
    </div>
  ),
  play: async ({ canvas }) => {
    const pad = (id: string) => getComputedStyle(canvas.getByTestId(id));
    await expect(['none', 'sm', 'md', 'lg'].map(id => pad(id).paddingTop)).toEqual([
      '0px',
      '12px',
      '16px',
      '24px',
    ]);
    await expect(['none', 'sm', 'md', 'lg'].map(id => pad(id).paddingLeft)).toEqual([
      '0px',
      '12px',
      '16px',
      '24px',
    ]);
  },
};

// The whole card is one button, reachable and usable from the keyboard.
export const Clickable: Story = {
  args: { onClick: fn(), 'aria-label': 'Card content, open vehicle' },
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getAllByRole('button')).toHaveLength(1);
    const card = canvas.getByRole('button', { name: 'Card content, open vehicle' });
    await expect(card).toHaveAttribute('type', 'button');
    await userEvent.tab();
    await expect(card).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};

export const Dark: Story = {
  globals: { theme: 'dark' },
};

export const ClickableDark: Story = {
  ...Clickable,
  globals: { theme: 'dark' },
};

// Keyboard focus needs a solid indicator: the soft ring alone is under 3:1.
export const ClickableFocusIndicator: Story = {
  args: { onClick: fn(), 'aria-label': 'Card content, open' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    const style = getComputedStyle(canvas.getByRole('button'));
    await expect(style.outlineStyle).toBe('solid');
    await expect(style.outlineWidth).toBe('1px');
  },
};

// A real border and a soft shadow, plain or clickable, not the primitive's thin ring.
export const BorderAndShadow: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Card data-testid="plain">Plain</Card>
      <Card data-testid="clickable" onClick={fn()} aria-label="Clickable">
        Clickable
      </Card>
    </div>
  ),
  play: async ({ canvas }) => {
    for (const id of ['plain', 'clickable']) {
      const style = getComputedStyle(canvas.getByTestId(id));
      await expect(style.borderTopWidth).toBe('1px');
      await expect(style.boxShadow).toContain('rgba(0, 0, 0, 0.1)');
    }
  },
};

// Adding onClick must not change how the card lays out its content.
export const ClickableMatchesPlain: Story = {
  args: { onClick: fn(), 'aria-label': 'Card content, open' },
  play: async ({ canvas }) => {
    const style = getComputedStyle(canvas.getByRole('button'));
    await expect(style.rowGap).toBe('16px');
    await expect(style.overflow).toBe('hidden');
  },
};
