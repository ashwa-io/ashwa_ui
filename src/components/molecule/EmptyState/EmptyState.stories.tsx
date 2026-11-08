import type { Meta, StoryObj } from '@storybook/react-vite';
import { InboxIcon } from 'lucide-react';
import { expect } from 'storybook/test';

import { Button } from '@/components/atomic/Button';

import { EmptyState } from './EmptyState';

const meta = {
  title: 'Molecule/EmptyState',
  component: EmptyState,
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No data found')).toBeVisible();
  },
};

export const WithAction: Story = {
  args: {
    title: 'No vehicles yet',
    description: 'Add your first vehicle to start tracking.',
    action: <Button>Add vehicle</Button>,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Add your first vehicle to start tracking.')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Add vehicle' })).toBeVisible();
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4">
      <EmptyState size="sm" title="Small" icon={InboxIcon} />
      <EmptyState size="md" title="Medium" icon={InboxIcon} />
    </div>
  ),
};

export const IconTile: Story = {
  args: { icon: InboxIcon },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('[data-variant="icon"] svg')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  },
};

export const CustomMediaWinsOverIcon: Story = {
  args: { icon: InboxIcon, media: <span data-testid="art">Art</span> },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByTestId('art')).toBeVisible();
    await expect(canvasElement.querySelector('[data-variant="icon"]')).toBeNull();
  },
};

export const Dark: Story = {
  args: { icon: InboxIcon, description: 'Nothing here yet.' },
  globals: { theme: 'dark' },
};
