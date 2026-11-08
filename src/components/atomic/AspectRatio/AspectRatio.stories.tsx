import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { AspectRatio } from './AspectRatio';

const meta = {
  title: 'Atomic/AspectRatio',
  component: AspectRatio,
  args: { children: <div data-testid="box" className="bg-muted size-full" /> },
  decorators: [Story => <div className="w-80">{Story()}</div>],
} satisfies Meta<typeof AspectRatio>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('box').getBoundingClientRect().height).toBe(180);
  },
};

export const Square: Story = {
  args: { ratio: 1 },
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('box').getBoundingClientRect().height).toBe(320);
  },
};
