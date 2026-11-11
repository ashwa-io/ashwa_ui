import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, fn } from 'storybook/test';

import { Switch, type SwitchProps } from './Switch';

const Controlled: React.FC<SwitchProps> = props => {
  const [value, setValue] = useState(props.value);
  return (
    <Switch
      {...props}
      value={value}
      onChange={next => {
        setValue(next);
        props.onChange(next);
      }}
    />
  );
};

const meta = {
  title: 'Atomic/Switch',
  component: Switch,
  args: { label: 'Active', value: false, onChange: fn() },
  render: args => <Controlled {...args} />,
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const toggle = canvas.getByRole('switch', { name: 'Active' });
    await userEvent.click(toggle);
    await expect(args.onChange).toHaveBeenCalledWith(true);
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
  },
};

// The label is a click target, like a native checkbox.
export const LabelToggles: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByText('Active'));
    await expect(args.onChange).toHaveBeenCalledWith(true);
    await expect(canvas.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  },
};

export const WithDescription: Story = {
  args: { description: 'Inactive vehicles are archived but keep their history.' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('switch')).toHaveAccessibleDescription(
      'Inactive vehicles are archived but keep their history.'
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    const toggle = canvas.getByRole('switch');
    await fireEvent.click(toggle);
    await expect(args.onChange).not.toHaveBeenCalled();
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
  },
};

export const HiddenLabel: Story = {
  args: { label: 'Enable tracking', hideLabel: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('switch', { name: 'Enable tracking' })).toBeInTheDocument();
    // A hidden label must not take its text width, or it widens the scroll area around it.
    const label = canvas.getByText('Enable tracking').closest('label');
    await expect(label?.getBoundingClientRect().width).toBeLessThanOrEqual(1);
  },
};

export const Dark: Story = {
  render: args => (
    <div className="flex flex-col gap-3">
      <Controlled {...args} label="Off" />
      <Controlled {...args} label="On" value />
    </div>
  ),
  globals: { theme: 'dark' },
};
