import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilterIcon } from 'lucide-react';
import { expect, fn, screen, waitFor } from 'storybook/test';

import { Text } from '@/components/atomic/Text';

import { Popover } from './Popover';

const meta = {
  title: 'Molecule/Popover',
  component: Popover,
  args: { label: 'Columns', children: <Text size="sm">Choose the columns to show.</Text> },
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Columns' }));
    const popup = await screen.findByRole('dialog', { name: 'Columns' });
    await expect(popup).toHaveTextContent('Choose the columns to show.');
  },
};

// Escape closes it and puts focus back on the trigger.
export const ReturnsFocus: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Columns' });
    await userEvent.click(trigger);
    await screen.findByRole('dialog', { name: 'Columns' });
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

export const IconOnly: Story = {
  args: { label: 'Filters', icon: FilterIcon, iconOnly: true, variant: 'ghost' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Filters' })).toBeVisible();
  },
};

const ControlledDemo: React.FC<{ onOpenChange: (open: boolean) => void }> = props => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex gap-3">
      <button type="button" onClick={() => setOpen(true)}>
        Open from outside
      </button>
      <Popover
        label="Columns"
        open={open}
        onOpenChange={next => {
          setOpen(next);
          props.onOpenChange(next);
        }}
      >
        <Text size="sm">Controlled content</Text>
      </Popover>
    </div>
  );
};

export const Controlled: Story = {
  args: { onOpenChange: fn() },
  render: args => <ControlledDemo onOpenChange={args.onOpenChange!} />,
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open from outside' }));
    await expect(await screen.findByText('Controlled content')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    await waitFor(() => expect(screen.queryByText('Controlled content')).toBeNull());
  },
};

export const Dark: Story = {
  globals: { theme: 'dark' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Columns' }));
    await screen.findByRole('dialog', { name: 'Columns' });
  },
};
