import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Spinner } from './Spinner';

const meta = {
  title: 'Atomic/Spinner',
  component: Spinner,
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status', { name: 'Loading' })).toBeVisible();
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
  play: async ({ canvas }) => {
    const widths = canvas.getAllByRole('status').map(svg => svg.getBoundingClientRect().width);
    await expect(widths).toEqual([16, 20, 32]);
  },
};

export const CustomLabel: Story = {
  args: { label: 'Loading devices' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status', { name: 'Loading devices' })).toBeVisible();
  },
};
