import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import type { Tone } from '@/lib/types';

import { StatusDot } from './StatusDot';

const TONES: Tone[] = ['neutral', 'brand', 'success', 'warning', 'danger', 'info'];

const meta = {
  title: 'Atomic/StatusDot',
  component: StatusDot,
  args: { label: 'Online' },
} satisfies Meta<typeof StatusDot>;

export default meta;

type Story = StoryObj<typeof meta>;

export const HasName: Story = {
  args: { tone: 'success' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img', { name: 'Online' })).toBeVisible();
  },
};

export const AllTones: Story = {
  render: () => (
    <div className="flex gap-2">
      {TONES.map(tone => (
        <StatusDot key={tone} tone={tone} label={tone} />
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const colors = TONES.map(
      tone => getComputedStyle(canvas.getByRole('img', { name: tone })).backgroundColor
    );
    await expect(new Set(colors).size).toBe(TONES.length);
  },
};

export const AllTonesDark: Story = {
  ...AllTones,
  globals: { theme: 'dark' },
};
