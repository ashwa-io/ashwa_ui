import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, waitFor } from 'storybook/test';

import { toast } from '@/components/molecule/Toaster';

import { UIProvider } from './UIProvider';

const meta = {
  title: 'Providers/UIProvider',
  component: UIProvider,
  args: { children: <div>App</div> },
  beforeEach: () => {
    toast.dismiss();
  },
} satisfies Meta<typeof UIProvider>;

export default meta;

type Story = StoryObj<typeof meta>;

// Apps mount UIProvider once and get toasts without their own bridge.
export const MountsToaster: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('App')).toBeVisible();
    toast.success('Saved');
    const message = await screen.findByText('Saved');
    await waitFor(() => expect(message).toBeVisible());
  },
};
