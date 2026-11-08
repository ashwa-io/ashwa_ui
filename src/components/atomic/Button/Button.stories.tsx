import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlusIcon } from 'lucide-react';
import { expect, fireEvent, fn } from 'storybook/test';

import { Button, type ButtonVariant } from './Button';

const VARIANTS: ButtonVariant[] = [
  'primary',
  'secondary',
  'outline',
  'ghost',
  'destructive',
  'link',
];

const meta = {
  title: 'Atomic/Button',
  component: Button,
  args: { children: 'Save', onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Save' });
    await expect(button).toHaveAttribute('type', 'button');
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const AllVariants: Story = {
  render: args => (
    <div className="flex flex-wrap items-center gap-3">
      {VARIANTS.map(variant => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
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
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};

export const WithIcon: Story = {
  args: { icon: PlusIcon, children: 'Add vehicle' },
};

export const Loading: Story = {
  args: { loading: true },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole('button', { name: 'Save' });
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await expect(button).toHaveAttribute('aria-disabled', 'true');
    // A submit that starts loading must keep keyboard focus (native `disabled` drops it).
    button.focus();
    await expect(button).toHaveFocus();
    await fireEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole('button', { name: 'Save' });
    await expect(button).toBeDisabled();
    await fireEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const FullWidth: Story = {
  args: { fullWidth: true },
  decorators: [Story => <div className="w-96">{Story()}</div>],
};
