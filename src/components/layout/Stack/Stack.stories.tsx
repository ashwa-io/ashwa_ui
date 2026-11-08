import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { HStack, Stack, VStack } from './Stack';

const Box: React.FC<{ label: string }> = props => (
  <div className="rounded-md border px-3 py-2 text-sm">{props.label}</div>
);

const meta = {
  title: 'Layout/Stack',
  component: Stack,
  args: {
    children: [
      <Box key="a" label="One" />,
      <Box key="b" label="Two" />,
      <Box key="c" label="Three" />,
    ],
  },
} satisfies Meta<typeof Stack>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Column: Story = {
  args: { gap: 2, 'data-testid': 'stack' },
  play: async ({ canvas }) => {
    await expect(getComputedStyle(canvas.getByTestId('stack')).flexDirection).toBe('column');
  },
};

export const Row: Story = {
  args: { direction: 'row', gap: 2, 'data-testid': 'stack' },
  play: async ({ canvas }) => {
    const style = getComputedStyle(canvas.getByTestId('stack'));
    await expect(style.flexDirection).toBe('row');
    await expect(style.columnGap).toBe('8px');
  },
};

export const Wrap: Story = {
  args: { direction: 'row', gap: 2, wrap: true, 'data-testid': 'stack' },
  decorators: [Story => <div className="w-32">{Story()}</div>],
  play: async ({ canvas }) => {
    await expect(getComputedStyle(canvas.getByTestId('stack')).flexWrap).toBe('wrap');
  },
};

export const HStackCentered: Story = {
  render: () => (
    <HStack gap={3} align="center" justify="between" data-testid="hstack">
      <Box label="Left" />
      <Box label="Right" />
    </HStack>
  ),
  play: async ({ canvas }) => {
    const style = getComputedStyle(canvas.getByTestId('hstack'));
    await expect(style.flexDirection).toBe('row');
    await expect(style.alignItems).toBe('center');
    await expect(style.justifyContent).toBe('space-between');
  },
};

export const VStackGap: Story = {
  render: () => (
    <VStack gap={4} data-testid="vstack">
      <Box label="Top" />
      <Box label="Bottom" />
    </VStack>
  ),
  play: async ({ canvas }) => {
    const style = getComputedStyle(canvas.getByTestId('vstack'));
    await expect(style.flexDirection).toBe('column');
    await expect(style.rowGap).toBe('16px');
  },
};
