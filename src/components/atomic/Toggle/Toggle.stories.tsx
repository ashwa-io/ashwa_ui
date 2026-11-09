import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { BoldIcon } from 'lucide-react';
import { expect, fn, waitFor } from 'storybook/test';

import { Toggle } from './Toggle';
import type { ToggleProps } from './Toggle';

const Controlled: React.FC<ToggleProps> = props => {
  const [pressed, setPressed] = useState(props.pressed);

  return (
    <Toggle
      {...props}
      pressed={pressed}
      onChange={next => {
        setPressed(next);
        props.onChange(next);
      }}
    />
  );
};

const secondary = () => {
  const probe = document.createElement('div');
  probe.className = 'bg-secondary';
  document.body.append(probe);
  const color = getComputedStyle(probe).backgroundColor;
  probe.remove();
  return color;
};

const meta = {
  title: 'Atomic/Toggle',
  component: Toggle,
  args: { pressed: false, onChange: fn(), children: 'Bold' },
  render: args => <Controlled {...args} />,
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Bold' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  },
};

export const Pressed: Story = {
  args: { pressed: true },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Bold' });
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await waitFor(() => expect(getComputedStyle(button).backgroundColor).toBe(secondary()));
  },
};

// Hovering must not drop the selected look.
export const PressedKeepsColourOnHover: Story = {
  args: { pressed: true },
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Bold' });
    await userEvent.hover(button);
    await waitFor(() => expect(getComputedStyle(button).backgroundColor).toBe(secondary()));
  },
};

export const Toggles: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Bold' });
    await userEvent.click(button);
    await expect(args.onChange).toHaveBeenLastCalledWith(true);
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(button);
    await expect(args.onChange).toHaveBeenLastCalledWith(false);
  },
};

export const IconOnly: Story = {
  args: { children: undefined, icon: BoldIcon, 'aria-label': 'Bold' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Bold' })).toBeVisible();
  },
};

export const Outline: Story = {
  args: { variant: 'outline' },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Bold' })).toBeDisabled();
  },
};

export const Dark: Story = {
  args: { pressed: true },
  globals: { theme: 'dark' },
};
