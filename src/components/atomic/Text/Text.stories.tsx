import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Text, type TextTone } from './Text';

const TONES: TextTone[] = ['neutral', 'muted', 'brand', 'success', 'warning', 'danger', 'info'];

const meta = {
  title: 'Atomic/Text',
  component: Text,
  args: { children: 'Hello' },
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Hello').tagName).toBe('P');
  },
};

export const AsSpan: Story = {
  args: { as: 'span' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Hello').tagName).toBe('SPAN');
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Text size="xs">Extra small</Text>
      <Text size="sm">Small</Text>
      <Text size="md">Medium</Text>
      <Text size="lg">Large</Text>
    </div>
  ),
};

export const Weights: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Text weight="normal">Normal</Text>
      <Text weight="medium">Medium</Text>
      <Text weight="semibold">Semibold</Text>
    </div>
  ),
};

export const AllTones: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {TONES.map(tone => (
        <Text key={tone} tone={tone}>
          {tone}
        </Text>
      ))}
    </div>
  ),
};

// Same tones in dark mode, so the a11y check covers both themes.
export const AllTonesDark: Story = {
  ...AllTones,
  globals: { theme: 'dark' },
};

// Without a tone, Text keeps its parent's colour (e.g. inside a badge or an error row).
export const InheritsColour: Story = {
  render: () => (
    <div className="text-destructive">
      <Text>Inherited</Text>
    </div>
  ),
  play: async ({ canvas }) => {
    const text = canvas.getByText('Inherited');
    await expect(getComputedStyle(text).color).toBe(getComputedStyle(text.parentElement!).color);
  },
};

// A span is inline, so truncation needs it to become a block.
export const Truncate: Story = {
  render: () => (
    <div className="w-40">
      <Text as="span" truncate>
        A very long line of text that cannot fit in the box
      </Text>
    </div>
  ),
  play: async ({ canvas }) => {
    const style = getComputedStyle(canvas.getByText(/A very long line/));
    await expect(style.textOverflow).toBe('ellipsis');
    await expect(style.display).toBe('block');
  },
};
