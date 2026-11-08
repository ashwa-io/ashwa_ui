import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Skeleton } from './Skeleton';

const meta = {
  title: 'Atomic/Skeleton',
  component: Skeleton,
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

// Skeletons fill their wrapper; the app sizes them with a plain div.
export const Shapes: Story = {
  render: () => (
    <div className="flex items-start gap-4">
      <div className="w-48">
        <Skeleton shape="text" />
      </div>
      <div className="w-12">
        <Skeleton shape="circle" />
      </div>
      <div className="h-24 w-48">
        <Skeleton shape="block" />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const skeletons = [...canvasElement.querySelectorAll('[data-slot="skeleton"]')];
    await expect(skeletons).toHaveLength(3);
    for (const skeleton of skeletons) {
      await expect(skeleton).toHaveAttribute('aria-hidden', 'true');
      await expect(skeleton.getBoundingClientRect().height).toBeGreaterThan(0);
    }
  },
};
