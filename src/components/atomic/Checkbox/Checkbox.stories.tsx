import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, fn } from 'storybook/test';

import { Checkbox, type CheckboxProps } from './Checkbox';

const Controlled: React.FC<CheckboxProps> = props => {
  const [value, setValue] = useState(props.value);
  return (
    <Checkbox
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
  title: 'Atomic/Checkbox',
  component: Checkbox,
  args: { label: 'Also save as a new template', value: false, onChange: fn() },
  render: args => <Controlled {...args} />,
} satisfies Meta<typeof Checkbox>;

export default meta;

// The tick takes the box's colour, so a fading box would start the tick black.
export const TickDoesNotFade: StoryObj<typeof meta> = {
  args: { value: true },
  play: async ({ canvas }) => {
    await expect(getComputedStyle(canvas.getByRole('checkbox')).transitionProperty).toBe('none');
  },
};

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const checkbox = canvas.getByRole('checkbox', { name: 'Also save as a new template' });
    await userEvent.click(checkbox);
    await expect(args.onChange).toHaveBeenCalledWith(true);
    await expect(checkbox).toHaveAttribute('aria-checked', 'true');
  },
};

// The label is a click target, like a native checkbox.
export const LabelToggles: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByText('Also save as a new template'));
    await expect(args.onChange).toHaveBeenCalledWith(true);
    await expect(canvas.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
  },
};

export const WithDescription: Story = {
  args: { description: 'Reuse these settings for the next vehicle.' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('checkbox')).toHaveAccessibleDescription(
      'Reuse these settings for the next vehicle.'
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    const checkbox = canvas.getByRole('checkbox');
    await fireEvent.click(checkbox);
    await expect(args.onChange).not.toHaveBeenCalled();
    await expect(checkbox).toHaveAttribute('aria-checked', 'false');
  },
};

// Table row selection: no visible label, the name stays.
export const HiddenLabel: Story = {
  args: { label: 'Select row', hideLabel: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('checkbox', { name: 'Select row' })).toBeInTheDocument();
  },
};

export const Dark: Story = {
  render: args => (
    <div className="flex flex-col gap-3">
      <Controlled {...args} label="Unchecked" />
      <Controlled {...args} label="Checked" value />
    </div>
  ),
  globals: { theme: 'dark' },
};

// Part of a list picked: a dash, not a tick and not an empty box.
export const Indeterminate: Story = {
  args: { indeterminate: true },
  play: async ({ canvas }) => {
    const box = canvas.getByRole('checkbox');
    await expect(box).toHaveAttribute('aria-checked', 'mixed');
    await expect(getComputedStyle(box.querySelector('svg')!).display).toBe('none');
  },
};
