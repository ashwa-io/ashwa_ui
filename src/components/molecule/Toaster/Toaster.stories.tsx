import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, waitFor } from 'storybook/test';

import { Button } from '@/components/atomic/Button';

import { toast } from './toast';
import { Toaster } from './Toaster';

const meta = {
  title: 'Molecule/Toaster',
  component: Toaster,
  // sonner's store is global: clear what the previous story left behind.
  beforeEach: () => {
    toast.dismiss();
  },
} satisfies Meta<typeof Toaster>;

export default meta;

type Story = StoryObj<typeof meta>;

const shows = async (text: string) => {
  const element = await screen.findByText(text);
  await waitFor(() => expect(element).toBeVisible());
};

export const Success: Story = {
  render: () => (
    <>
      <Toaster />
      <Button onClick={() => toast.success('Saved', { description: 'Vehicle updated' })}>
        Save
      </Button>
    </>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }));
    await shows('Saved');
    await shows('Vehicle updated');
  },
};

export const AllTypes: Story = {
  render: () => <Toaster />,
  play: async () => {
    toast.message('Heads up');
    toast.info('Sync started');
    toast.warning('Low balance');
    toast.error('Could not save');
    await shows('Could not save');
  },
};

export const Dismiss: Story = {
  render: () => <Toaster />,
  play: async () => {
    const id = toast.message('Going away', { duration: 60_000 });
    await shows('Going away');
    toast.dismiss(id);
    await waitFor(() => expect(screen.queryByText('Going away')).toBeNull(), { timeout: 3000 });
  },
};

// Non-React callers (the axios interceptor) can fire before <Toaster /> has mounted.
export const QueuedBeforeMount: Story = {
  beforeEach: () => {
    toast.error('Session expired');
  },
  render: () => <Toaster />,
  play: async () => {
    await shows('Session expired');
  },
};

export const Dark: Story = {
  globals: { theme: 'dark' },
  render: () => <Toaster />,
  play: async () => {
    toast.success('Saved', { description: 'Vehicle updated' });
    await shows('Vehicle updated');
  },
};
