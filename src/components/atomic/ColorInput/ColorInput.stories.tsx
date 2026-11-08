import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, fn } from 'storybook/test';

import { ColorInput, type ColorInputProps } from './ColorInput';

const Controlled: React.FC<ColorInputProps> = props => {
  const [value, setValue] = useState(props.value);
  return (
    <ColorInput
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
  title: 'Atomic/ColorInput',
  component: ColorInput,
  args: { label: 'Brand colour', value: '#8750f6', onChange: fn() },
  render: args => <Controlled {...args} />,
} satisfies Meta<typeof ColorInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox', { name: 'Brand colour' })).toHaveValue('#8750f6');
    await expect(canvas.getByLabelText('Brand colour picker')).toHaveValue('#8750f6');
  },
};

// Partial hex never reaches the form; a complete one arrives normalized.
export const TypingHex: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const text = canvas.getByRole('textbox', { name: 'Brand colour' });
    await userEvent.clear(text);
    await userEvent.type(text, '#1a7');
    await expect(args.onChange).not.toHaveBeenCalled();
    await userEvent.type(text, '3E8');
    await expect(args.onChange).toHaveBeenLastCalledWith('#1a73e8');
    await expect(canvas.getByLabelText('Brand colour picker')).toHaveValue('#1a73e8');
  },
};

export const InvalidBlurResets: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const text = canvas.getByRole('textbox', { name: 'Brand colour' });
    await userEvent.clear(text);
    await userEvent.type(text, 'zzz');
    await userEvent.tab();
    await expect(text).toHaveValue('#8750f6');
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};

export const PickerChanges: Story = {
  play: async ({ args, canvas }) => {
    await fireEvent.change(canvas.getByLabelText('Brand colour picker'), {
      target: { value: '#16a34a' },
    });
    await expect(args.onChange).toHaveBeenLastCalledWith('#16a34a');
    await expect(canvas.getByRole('textbox', { name: 'Brand colour' })).toHaveValue('#16a34a');
  },
};

export const WithError: Story = {
  args: { error: 'Pick a darker colour', description: 'Used for buttons and links' },
  play: async ({ canvas }) => {
    const text = canvas.getByRole('textbox', { name: 'Brand colour' });
    await expect(text).toHaveAttribute('aria-invalid', 'true');
    await expect(text).toHaveAccessibleDescription(
      'Used for buttons and links Pick a darker colour'
    );
  },
};

export const Dark: Story = {
  globals: { theme: 'dark' },
};
