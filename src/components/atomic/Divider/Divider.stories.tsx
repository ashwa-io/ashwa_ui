import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Text } from '@/components/atomic/Text';
import { HStack } from '@/components/layout/Stack';

import { Divider } from './Divider';

const meta = {
  title: 'Atomic/Divider',
  component: Divider,
} satisfies Meta<typeof Divider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('separator')).toBeVisible();
  },
};

// No sized wrapper needed: a vertical divider stretches to the row's height.
export const VerticalInHStack: Story = {
  render: () => (
    <HStack gap={2} data-testid="row">
      <Text>A</Text>
      <Divider orientation="vertical" />
      <Text>B</Text>
    </HStack>
  ),
  play: async ({ canvas }) => {
    const divider = canvas.getByRole('separator').getBoundingClientRect();
    const row = canvas.getByTestId('row').getBoundingClientRect();
    await expect(divider.height).toBeGreaterThan(0);
    await expect(divider.height).toBe(row.height);
  },
};
