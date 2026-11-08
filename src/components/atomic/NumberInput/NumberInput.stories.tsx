import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, fn } from 'storybook/test';

import { NumberInput } from './NumberInput';
import type { NumberInputProps } from './NumberInput';

const Controlled: React.FC<NumberInputProps> = props => {
  const [value, setValue] = useState(props.value);

  return (
    <NumberInput
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
  title: 'Atomic/NumberInput',
  component: NumberInput,
  args: { label: 'Capacity', value: null, onChange: fn() },
  render: args => <Controlled {...args} />,
} satisfies Meta<typeof NumberInput>;

export default meta;

type Story = StoryObj<typeof meta>;

const field = (canvas: { getByRole: (role: string, options: object) => HTMLElement }) =>
  canvas.getByRole('spinbutton', { name: 'Capacity' }) as HTMLInputElement;

export const Default: Story = {
  args: { value: 12 },
  play: async ({ canvas }) => {
    await expect(field(canvas)).toHaveValue(12);
  },
};

// The field keeps exactly what was typed, while the app gets the number. fireEvent because
// simulated typing normalises number inputs; real keys keep "1.50" too.
export const TypesDecimals: Story = {
  play: async ({ args, canvas }) => {
    await fireEvent.change(field(canvas), { target: { value: '1.5' } });
    await fireEvent.change(field(canvas), { target: { value: '1.50' } });
    await expect(field(canvas).value).toBe('1.50');
    await expect(args.onChange).toHaveBeenLastCalledWith(1.5);
  },
};

export const TypesNegative: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.type(field(canvas), '-5');
    await expect(field(canvas).value).toBe('-5');
    await expect(args.onChange).toHaveBeenLastCalledWith(-5);
  },
};

export const EmptiesToNull: Story = {
  args: { value: 5 },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.clear(field(canvas));
    await expect(args.onChange).toHaveBeenLastCalledWith(null);
    await expect(field(canvas).value).toBe('');
  },
};

export const ZeroIsAValue: Story = {
  args: { value: 0 },
  play: async ({ canvas }) => {
    await expect(field(canvas).value).toBe('0');
  },
};

export const MinMaxAttributes: Story = {
  args: { min: 1, max: 9, step: 2 },
  play: async ({ canvas }) => {
    await expect(field(canvas)).toHaveAttribute('min', '1');
    await expect(field(canvas)).toHaveAttribute('max', '9');
    await expect(field(canvas)).toHaveAttribute('step', '2');
  },
};

export const WithEndText: Story = {
  args: { endText: 'km' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('km')).toBeVisible();
  },
};

export const WithError: Story = {
  args: { error: 'Enter a capacity' },
  play: async ({ canvas }) => {
    await expect(field(canvas)).toHaveAttribute('aria-invalid', 'true');
  },
};

export const Dark: Story = {
  args: { value: 12, endText: 'km' },
  globals: { theme: 'dark' },
};

// Scrolling past a focused field must not quietly change its number.
export const WheelLeavesValueAlone: Story = {
  args: { value: 2024 },
  play: async ({ canvas }) => {
    const input = field(canvas);
    input.focus();
    await expect(input).toHaveFocus();
    await fireEvent.wheel(input, { deltaY: 100 });
    await expect(input).not.toHaveFocus();
  },
};
