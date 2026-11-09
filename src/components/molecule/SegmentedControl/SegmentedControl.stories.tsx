import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor } from 'storybook/test';

import { SegmentedControl } from './SegmentedControl';
import type { SegmentedControlProps, SegmentedOption } from './SegmentedControl';

const options: SegmentedOption[] = [
  { value: 'inherit', label: 'Inherit' },
  { value: 'on', label: 'On' },
  { value: 'off', label: 'Off' },
  { value: 'beta', label: 'Beta', disabled: true },
];

const Controlled: React.FC<SegmentedControlProps> = props => {
  const [value, setValue] = useState(props.value);

  return (
    <SegmentedControl
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
  title: 'Molecule/SegmentedControl',
  component: SegmentedControl,
  args: { label: 'Override', value: 'inherit', onChange: fn(), options },
  render: args => <Controlled {...args} />,
} satisfies Meta<typeof SegmentedControl>;

export default meta;

type Story = StoryObj<typeof meta>;

const pressed = (button: HTMLElement) => button.getAttribute('aria-pressed');

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('group', { name: 'Override' })).toBeVisible();
    await expect(pressed(canvas.getByRole('button', { name: 'Inherit' }))).toBe('true');
    await expect(pressed(canvas.getByRole('button', { name: 'On' }))).toBe('false');
  },
};

export const Selects: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const on = canvas.getByRole('button', { name: 'On' });
    await userEvent.click(on);
    await expect(args.onChange).toHaveBeenCalledWith('on');
    await expect(pressed(on)).toBe('true');
    await expect(pressed(canvas.getByRole('button', { name: 'Inherit' }))).toBe('false');
  },
};

// One option is always selected: clicking it again changes nothing.
export const CannotDeselect: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const current = canvas.getByRole('button', { name: 'Inherit' });
    await userEvent.click(current);
    await expect(args.onChange).not.toHaveBeenCalled();
    await expect(pressed(current)).toBe('true');
  },
};

export const DisabledOption: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Beta' })).toBeDisabled();
  },
};

export const KeyboardMoves: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Inherit' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('button', { name: 'On' })).toHaveFocus();
    await userEvent.keyboard(' ');
    await waitFor(() => expect(args.onChange).toHaveBeenCalledWith('on'));
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'On' })).toBeDisabled();
  },
};

export const Small: Story = {
  args: { size: 'sm' },
};

export const Ghost: Story = {
  args: { variant: 'ghost' },
  play: async ({ canvas }) => {
    await expect(getComputedStyle(canvas.getByRole('button', { name: 'On' })).borderTopWidth).toBe(
      '0px'
    );
  },
};

export const Dark: Story = {
  globals: { theme: 'dark' },
};

// The active option is filled with the brand, like nigam's Halts | Properties pill.
export const ActiveIsFilled: Story = {
  play: async ({ canvas }) => {
    const probe = document.createElement('div');
    probe.className = 'bg-primary';
    document.body.append(probe);
    const primary = getComputedStyle(probe).backgroundColor;
    probe.remove();
    const active = canvas.getByRole('button', { name: 'Inherit' });
    await expect(getComputedStyle(active).backgroundColor).toBe(primary);
  },
};
