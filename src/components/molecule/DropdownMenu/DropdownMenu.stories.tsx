import type { Meta, StoryObj } from '@storybook/react-vite';
import { PencilIcon, ShieldIcon, Trash2Icon } from 'lucide-react';
import { expect, fireEvent, fn, screen, waitFor } from 'storybook/test';

import { DropdownMenu, type MenuItem } from './DropdownMenu';

const items = (): MenuItem[] => [
  {
    label: 'Edit details',
    description: 'Update the name and description',
    icon: PencilIcon,
    onSelect: fn(),
  },
  {
    label: 'Edit permissions',
    description: 'Change what this role can access',
    icon: ShieldIcon,
    onSelect: fn(),
    disabled: true,
  },
  {
    label: 'Delete role',
    description: 'Remove this role permanently',
    icon: Trash2Icon,
    onSelect: fn(),
    destructive: true,
  },
];

const meta = {
  title: 'Molecule/DropdownMenu',
  component: DropdownMenu,
  args: { label: 'Actions', items: items() },
} satisfies Meta<typeof DropdownMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { items: items() },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Actions' }));
    await screen.findByRole('menu');
    await userEvent.click(screen.getByRole('menuitem', { name: /Edit details/ }));
    await expect(args.items[0].onSelect).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  },
};

export const Keyboard: Story = {
  args: { items: items() },
  play: async ({ args, canvas, userEvent }) => {
    canvas.getByRole('button', { name: 'Actions' }).focus();
    await userEvent.keyboard('{ArrowDown}');
    await screen.findByRole('menu');
    await waitFor(() =>
      expect(screen.getByRole('menuitem', { name: /Edit details/ })).toHaveFocus()
    );
    await userEvent.keyboard('{Enter}');
    await expect(args.items[0].onSelect).toHaveBeenCalledOnce();
    // Finish closed so the next story (and axe) sees a settled page.
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  },
};

export const DisabledItem: Story = {
  args: { items: items() },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Actions' }));
    const disabled = await screen.findByRole('menuitem', { name: /Edit permissions/ });
    await expect(disabled).toHaveAttribute('aria-disabled', 'true');
    await fireEvent.click(disabled);
    await expect(args.items[1].onSelect).not.toHaveBeenCalled();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  },
};

// Escape closes it and puts focus back on the trigger.
export const ReturnsFocus: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Actions' });
    await userEvent.click(trigger);
    await screen.findByRole('menu');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

// Open in dark mode so axe checks the destructive item on the popup surface.
export const Dark: Story = {
  globals: { theme: 'dark' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Actions' }));
    await screen.findByRole('menuitem', { name: /Delete role/ });
  },
};
