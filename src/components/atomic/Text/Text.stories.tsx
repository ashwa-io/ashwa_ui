import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, waitFor } from 'storybook/test';

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

const LONG = 'A very long line of text that cannot fit in the box';
const TIP = { selector: '[data-slot="tooltip-content"]' };

// Gives a tooltip that would open a moment to do so, so its absence means something.
const settle = () => new Promise(resolve => setTimeout(resolve, 150));

// A span is inline, so truncation needs it to become a block. Cut-off text shows in full on hover.
export const Truncate: Story = {
  render: () => (
    // Room above, so the tooltip takes its default top side.
    <div className="w-40 pt-12">
      <Text as="span" truncate>
        {LONG}
      </Text>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const text = canvas.getByText(LONG);
    const style = getComputedStyle(text);
    await expect(style.textOverflow).toBe('ellipsis');
    await expect(style.display).toBe('block');
    await userEvent.hover(text);
    // The popup fades in; wait until it is visible rather than checking mid-animation.
    const tip = await screen.findByText(LONG, TIP);
    await waitFor(() => expect(tip).toBeVisible());
    // Anchored to the text itself (it is the trigger), above it.
    await waitFor(() =>
      expect(tip.getBoundingClientRect().bottom).toBeLessThanOrEqual(
        text.getBoundingClientRect().top
      )
    );
  },
};

// Text that fits has nothing to reveal, so hovering it shows no tooltip.
export const TruncateFits: Story = {
  render: () => (
    <div className="w-40">
      <Text truncate>Short</Text>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.hover(canvas.getByText('Short'));
    await settle();
    await expect(screen.queryByText('Short', TIP)).not.toBeInTheDocument();
  },
};

// Without truncate the text wraps, and no tooltip machinery is rendered at all.
export const NoTruncateNoTooltip: Story = {
  render: () => (
    <div className="w-40">
      <Text>{LONG}</Text>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const text = canvas.getByText(LONG);
    await expect(text).not.toHaveAttribute('data-base-ui-tooltip-trigger');
    await userEvent.hover(text);
    await settle();
    await expect(screen.queryByText(LONG, TIP)).not.toBeInTheDocument();
  },
};

// The tooltip shows the text as written, including text from nested elements.
export const TruncateNestedText: Story = {
  render: () => (
    <div className="w-40">
      <Text truncate>
        Registration number <Text as="span">MH 12 AB 1234</Text> and more
      </Text>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.hover(canvas.getByText(/Registration number/));
    const tip = await screen.findByText('Registration number MH 12 AB 1234 and more', TIP);
    await waitFor(() => expect(tip).toBeVisible());
  },
};

// Without a size, Text keeps its parent's size, so an emphasised span stays in line.
export const NestedKeepsSize: Story = {
  render: () => (
    <Text size="sm">
      Total:{' '}
      <Text as="span" weight="semibold">
        42
      </Text>
    </Text>
  ),
  play: async ({ canvas }) => {
    const inner = canvas.getByText('42');
    await expect(getComputedStyle(inner).fontSize).toBe(
      getComputedStyle(inner.parentElement!).fontSize
    );
  },
};
