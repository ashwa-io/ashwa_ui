import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, fn, screen, waitFor } from 'storybook/test';

import { Button } from '@/components/atomic/Button';

import { ConfirmDialog, type ConfirmDialogProps } from './ConfirmDialog';

// Controlled like the app: an Open button sets state, onClose clears it, onConfirm leaves it open.
const Demo: React.FC<Omit<ConfirmDialogProps, 'open'>> = props => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <ConfirmDialog
        {...props}
        open={open}
        onClose={() => {
          setOpen(false);
          props.onClose();
        }}
      />
    </>
  );
};

const meta = {
  title: 'Molecule/ConfirmDialog',
  component: ConfirmDialog,
  args: {
    open: false,
    onClose: fn(),
    onConfirm: fn(),
    title: 'Delete route?',
    description: 'Past runs keep their own commands.',
    confirmLabel: 'Delete route',
    destructive: true,
  },
  render: args => <Demo {...args} />,
} satisfies Meta<typeof ConfirmDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open' }));
    const dialog = await screen.findByRole('alertdialog', { name: 'Delete route?' });
    await expect(dialog).toHaveAccessibleDescription('Past runs keep their own commands.');
    await userEvent.click(screen.getByRole('button', { name: 'Delete route' }));
    await expect(args.onConfirm).toHaveBeenCalledOnce();
    // Confirming never closes it: the app closes it when its work finishes.
    await expect(dialog).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await expect(args.onClose).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
  },
};

// Closing puts focus back on the button that opened it.
export const ReturnsFocus: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open' }));
    await screen.findByRole('alertdialog');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
    await expect(canvas.getByRole('button', { name: 'Open' })).toHaveFocus();
  },
};

export const CustomCancelLabel: Story = {
  args: { cancelLabel: 'Keep route', destructive: false },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open' }));
    await userEvent.click(await screen.findByRole('button', { name: 'Keep route' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
  },
};

// While the app's work runs: one press only, and Escape can't abandon it.
export const Loading: Story = {
  args: { loading: true },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open' }));
    const confirm = await screen.findByRole('button', { name: 'Delete route' });
    await expect(confirm).toHaveAttribute('aria-busy', 'true');
    await fireEvent.click(confirm);
    await expect(args.onConfirm).not.toHaveBeenCalled();
    await userEvent.keyboard('{Escape}');
    await expect(args.onClose).not.toHaveBeenCalled();
    await expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  },
};

export const Dark: Story = {
  globals: { theme: 'dark' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open' }));
    await waitFor(() => expect(screen.getByRole('alertdialog')).toBeVisible());
  },
};
