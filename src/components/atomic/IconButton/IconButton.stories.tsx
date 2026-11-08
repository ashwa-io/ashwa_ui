import type { Meta, StoryObj } from '@storybook/react-vite';
import { Trash2Icon } from 'lucide-react';
import { expect, fireEvent, fn } from 'storybook/test';

import { IconButton, type IconButtonVariant } from './IconButton';

const VARIANTS: IconButtonVariant[] = ['primary', 'secondary', 'outline', 'ghost', 'destructive'];

const meta = {
  title: 'Atomic/IconButton',
  component: IconButton,
  args: { icon: Trash2Icon, 'aria-label': 'Delete', onClick: fn() },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Delete' });
    await expect(button).toHaveAttribute('type', 'button');
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const AllVariants: Story = {
  render: args => (
    <div className="flex items-center gap-3">
      {VARIANTS.map(variant => (
        <IconButton
          key={variant}
          icon={args.icon}
          aria-label={`Delete (${variant})`}
          variant={variant}
        />
      ))}
    </div>
  ),
};

// Same variants in dark mode, so the a11y check covers both themes.
export const AllVariantsDark: Story = {
  ...AllVariants,
  globals: { theme: 'dark' },
};

export const Sizes: Story = {
  render: args => (
    <div className="flex items-center gap-3">
      <IconButton icon={args.icon} aria-label="Small" size="sm" />
      <IconButton icon={args.icon} aria-label="Medium" size="md" />
      <IconButton icon={args.icon} aria-label="Large" size="lg" />
    </div>
  ),
  play: async ({ canvas }) => {
    const widths = canvas.getAllByRole('button').map(b => b.getBoundingClientRect().width);
    await expect(widths[0]).toBeLessThan(widths[1]);
    await expect(widths[1]).toBeLessThan(widths[2]);
  },
};

export const Loading: Story = {
  args: { loading: true },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole('button', { name: 'Delete' });
    await expect(button).toHaveAttribute('aria-busy', 'true');
    // Keeps keyboard focus while loading, like Button.
    button.focus();
    await expect(button).toHaveFocus();
    await fireEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
