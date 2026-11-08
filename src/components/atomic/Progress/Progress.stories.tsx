import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { Progress } from './Progress';

const meta = {
  title: 'Atomic/Progress',
  component: Progress,
  args: { label: 'Upload progress' },
  decorators: [Story => <div className="w-64">{Story()}</div>],
} satisfies Meta<typeof Progress>;

export default meta;

type Story = StoryObj<typeof meta>;

const widths = (root: HTMLElement) => ({
  track: root.querySelector('[data-slot="progress-track"]')!.getBoundingClientRect().width,
  indicator: root.querySelector('[data-slot="progress-indicator"]')!.getBoundingClientRect().width,
});

export const Determinate: Story = {
  args: { value: 40 },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('progressbar', { name: 'Upload progress' })).toHaveAttribute(
      'aria-valuenow',
      '40'
    );
    await waitFor(() => {
      const { track, indicator } = widths(canvasElement);
      expect(indicator / track).toBeCloseTo(0.4, 1);
    });
    await expect(canvas.getByText('40%')).toBeVisible();
  },
};

export const Indeterminate: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
    await waitFor(() => {
      const { track, indicator } = widths(canvasElement);
      expect(indicator).toBe(track);
    });
  },
};

export const ClampsValue: Story = {
  args: { value: 150 },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    await waitFor(() => {
      const { track, indicator } = widths(canvasElement);
      expect(indicator).toBeLessThanOrEqual(track);
    });
  },
};

export const HiddenLabelKeepsName: Story = {
  args: { value: 40, hideLabel: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('progressbar', { name: 'Upload progress' })).toBeInTheDocument();
    await expect(canvas.queryByText('40%')).toBeNull();
  },
};

export const Dark: Story = {
  args: { value: 60 },
  globals: { theme: 'dark' },
};
