import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Kbd } from './Kbd';

const meta = {
  title: 'Atomic/Kbd',
  component: Kbd,
  args: { keys: ['Esc'] },
} satisfies Meta<typeof Kbd>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SingleKey: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText('Esc')).toBeVisible();
    await expect(canvasElement.querySelectorAll('[data-slot="kbd"]')).toHaveLength(1);
  },
};

export const Combination: Story = {
  args: { keys: ['Ctrl', 'B'] },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-slot="kbd"]')).toHaveLength(2);
  },
};

export const Dark: Story = {
  args: { keys: ['Ctrl', 'B'] },
  globals: { theme: 'dark' },
};
