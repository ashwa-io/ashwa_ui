import type { Meta, StoryObj } from '@storybook/react-vite';
import { PanelLeftCloseIcon } from 'lucide-react';
import { expect, screen, waitFor } from 'storybook/test';

import { IconButton } from '@/components/atomic/IconButton';

import { Tooltip } from './Tooltip';

const meta = {
  title: 'Atomic/Tooltip',
  component: Tooltip,
  args: {
    content: 'Collapse sidebar',
    children: <IconButton icon={PanelLeftCloseIcon} aria-label="Collapse" />,
  },
  decorators: [Story => <div className="p-12">{Story()}</div>],
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.hover(canvas.getByRole('button', { name: 'Collapse' }));
    // The popup fades in; wait until it is visible rather than checking mid-animation.
    const tip = await screen.findByText('Collapse sidebar');
    await waitFor(() => expect(tip).toBeVisible());
  },
};

// Keyboard users get the same hint when the wrapped control takes focus.
export const ShowsOnFocus: Story = {
  play: async ({ userEvent }) => {
    await userEvent.tab();
    // The popup fades in; wait until it is visible rather than checking mid-animation.
    const tip = await screen.findByText('Collapse sidebar');
    await waitFor(() => expect(tip).toBeVisible());
  },
};

export const Sides: Story = {
  render: args => (
    <div className="flex gap-8">
      <Tooltip content="Top">{args.children}</Tooltip>
      <Tooltip content="Bottom" side="bottom">
        {args.children}
      </Tooltip>
      <Tooltip content="Left" side="left">
        {args.children}
      </Tooltip>
      <Tooltip content="Right" side="right">
        {args.children}
      </Tooltip>
    </div>
  ),
};
