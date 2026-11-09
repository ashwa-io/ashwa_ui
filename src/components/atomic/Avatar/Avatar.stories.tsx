import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { Avatar } from './Avatar';

const PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';

const meta = {
  title: 'Atomic/Avatar',
  component: Avatar,
  args: { name: 'Aarav Sharma' },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('AS')).toBeVisible();
    await expect(canvas.getByRole('img', { name: 'Aarav Sharma' })).toBeInTheDocument();
  },
};

export const WithImage: Story = {
  args: { src: PIXEL },
  play: async ({ canvas }) => {
    await waitFor(() =>
      expect(canvas.getByRole('img', { name: 'Aarav Sharma' }).tagName).toBe('IMG')
    );
  },
};

// A dead URL falls back to initials rather than a broken image.
export const BrokenImage: Story = {
  args: { src: 'data:image/png;base64,broken' },
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('AS')).toBeVisible();
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar name="Small One" size="sm" data-testid="sm" />
      <Avatar name="Medium Two" size="md" data-testid="md" />
      <Avatar name="Large Three" size="lg" data-testid="lg" />
    </div>
  ),
  play: async ({ canvas }) => {
    const width = (id: string) => canvas.getByTestId(id).getBoundingClientRect().width;
    await expect([width('sm'), width('md'), width('lg')]).toEqual([24, 32, 48]);
  },
};

export const Shapes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar name="Round Shape" shape="circle" data-testid="circle" />
      <Avatar name="Square Shape" shape="rounded" data-testid="rounded" />
    </div>
  ),
  play: async ({ canvas }) => {
    const radius = (id: string) =>
      parseFloat(getComputedStyle(canvas.getByTestId(id)).borderRadius);
    await expect(radius('circle')).toBeGreaterThan(radius('rounded'));
  },
};

export const PixelSize: Story = {
  args: { size: 40, 'data-testid': 'avatar' },
  play: async ({ canvas }) => {
    const { width, height } = canvas.getByTestId('avatar').getBoundingClientRect();
    await expect([width, height]).toEqual([40, 40]);
  },
};

export const Dark: Story = {
  globals: { theme: 'dark' },
};
