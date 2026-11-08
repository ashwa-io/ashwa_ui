import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Button } from '@/components/atomic/Button';

import { Alert } from './Alert';
import type { AlertTone } from './Alert';

const TONES: AlertTone[] = ['info', 'success', 'warning', 'danger'];

const meta = {
  title: 'Atomic/Alert',
  component: Alert,
  args: { title: 'Device offline' },
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllTones: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-2">
      {TONES.map(tone => (
        <Alert key={tone} tone={tone} title={tone} description="Last seen ten minutes ago." />
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('danger')).toBeVisible();
  },
};

// Same tones in dark mode, so the a11y check covers tinted alerts on dark surfaces.
export const AllTonesDark: Story = {
  ...AllTones,
  globals: { theme: 'dark' },
};

export const DangerAnnounces: Story = {
  args: { tone: 'danger' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent('Device offline');
  },
};

// Announcing every info banner on page load would drown screen reader users.
export const InfoIsPolite: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent('Device offline');
    await expect(canvas.queryByRole('alert')).toBeNull();
  },
};

export const WithAction: Story = {
  args: { action: <Button size="sm">Retry</Button> },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Retry' })).toBeVisible();
  },
};

// The action sits below the text: beside it, a wide button would cover the words.
export const WideActionKeepsTextClear: Story = {
  args: {
    title: 'Your plan expires in three days and tracking stops after that',
    description: 'Renew now to keep every vehicle online.',
    action: <Button size="sm">Open billing</Button>,
  },
  decorators: [Story => <div className="w-80">{Story()}</div>],
  play: async ({ canvas, canvasElement }) => {
    const action = canvas.getByRole('button', { name: 'Open billing' }).getBoundingClientRect();
    const description = canvasElement
      .querySelector('[data-slot="alert-description"]')!
      .getBoundingClientRect();
    await expect(action.top).toBeGreaterThanOrEqual(description.bottom);
  },
};
