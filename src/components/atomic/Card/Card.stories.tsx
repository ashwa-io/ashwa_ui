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

export const Fill: Story = {
  render: () => (
    <div className="grid h-48 grid-cols-2 gap-4">
      <Card fill>Short</Card>
      <Card fill>
        <span>Taller content</span>
        <span>on two lines</span>
      </Card>
    </div>
  ),
  play: async ({ canvas }) => {
    // The text sits straight in the card, so the match is the card itself.
    const card = canvas.getByText('Short');
    const row = card.parentElement;
    // Both cards take the row's height, so their bottoms line up.
    await expect(card.getBoundingClientRect().height).toBe(row?.getBoundingClientRect().height);
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

// Adding onClick must not change how the card lays out its content.
export const ClickableMatchesPlain: Story = {
  args: { onClick: fn(), 'aria-label': 'Card content, open' },
  play: async ({ canvas }) => {
    const style = getComputedStyle(canvas.getByRole('button'));
    await expect(style.rowGap).toBe('16px');
    await expect(style.overflow).toBe('hidden');
  },
};
