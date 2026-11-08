import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckIcon } from 'lucide-react';
import { expect } from 'storybook/test';

import type { Tone } from '@/lib/types';

import { Badge } from './Badge';

const TONES: Tone[] = ['neutral', 'brand', 'success', 'warning', 'danger', 'info'];

const meta = {
  title: 'Atomic/Badge',
  component: Badge,
  args: { children: 'Active' },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllTones: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      {TONES.map(tone => (
        <Badge key={tone} tone={tone}>
          {tone}
        </Badge>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('success')).toBeVisible();
  },
};

// Same tones in dark mode, so the a11y check covers tinted badges on dark surfaces.
export const AllTonesDark: Story = {
  ...AllTones,
  globals: { theme: 'dark' },
};

export const WithIcon: Story = {
  args: { tone: 'success', icon: CheckIcon, children: 'Verified' },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  },
};
