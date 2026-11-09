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

// A complete hex arrives normalized; anything else reaches the form as typed, so its
// validation (e.g. "Use a 6-digit hex") can flag a typo instead of silently keeping the old colour.
export const TypingHex: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const text = canvas.getByRole('textbox', { name: 'Brand colour' });
    await userEvent.clear(text);
    await userEvent.type(text, '#1a7');
    await expect(args.onChange).toHaveBeenLastCalledWith('#1a7');
    await userEvent.type(text, '3E8');
    await expect(args.onChange).toHaveBeenLastCalledWith('#1a73e8');
    await expect(text).toHaveValue('#1a73e8');
    await expect(canvas.getByLabelText('Brand colour picker')).toHaveValue('#1a73e8');
  },
};

// A typo survives blur (no silent revert to the old colour), so Save cannot submit it unseen.
export const InvalidKeptForValidation: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const text = canvas.getByRole('textbox', { name: 'Brand colour' });
    await userEvent.clear(text);
    await userEvent.type(text, '#1a73e');
    await userEvent.tab();
    await expect(text).toHaveValue('#1a73e');
    await expect(args.onChange).toHaveBeenLastCalledWith('#1a73e');
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

// A colour input cannot be empty: white reads as nothing chosen, where black read as a choice.
export const EmptyLooksUnset: Story = {
  args: { value: '' },
  play: async ({ canvasElement }) => {
    const swatch = canvasElement.querySelector<HTMLInputElement>('input[type="color"]')!;
    await expect(swatch.value).toBe('#ffffff');
  },
};
