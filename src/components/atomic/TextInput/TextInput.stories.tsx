import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchIcon } from 'lucide-react';
import { expect, fn } from 'storybook/test';

import { TextInput, type TextInputProps } from './TextInput';

// Controlled like a react-hook-form Controller: value in, onChange(value) out.
const Controlled: React.FC<TextInputProps> = props => {
  const [value, setValue] = useState(props.value);
  return (
    <TextInput
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
  title: 'Atomic/TextInput',
  component: TextInput,
  args: { label: 'Name', value: '', onChange: fn(), placeholder: 'e.g. Hisar' },
  render: args => <Controlled {...args} />,
} satisfies Meta<typeof TextInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole('textbox', { name: 'Name' });
    await userEvent.type(input, 'Hisar');
    await expect(input).toHaveValue('Hisar');
    await expect(args.onChange).toHaveBeenLastCalledWith('Hisar');
  },
};

export const WithIcon: Story = {
  args: { label: 'Search vehicles', icon: SearchIcon, type: 'search' },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  },
};

export const Password: Story = {
  args: { label: 'Password', type: 'password', autoComplete: 'current-password' },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Password')).toHaveAttribute('type', 'password');
  },
};

export const WithError: Story = {
  args: { required: true, error: 'Name is required', description: 'Shown on invoices' },
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Name' });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription('Shown on invoices Name is required');
  },
};

export const States: Story = {
  render: args => (
    <div className="flex flex-col gap-4">
      <Controlled {...args} label="Disabled" value="Locked" disabled />
      <Controlled {...args} label="Read only" value="Fixed" readOnly />
    </div>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const disabled = canvas.getByRole('textbox', { name: 'Disabled' });
    const readOnly = canvas.getByRole('textbox', { name: 'Read only' });
    await expect(disabled).toBeDisabled();
    await userEvent.type(readOnly, 'x');
    await expect(readOnly).toHaveValue('Fixed');
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};

// Same states in dark mode, so the a11y check covers both themes.
export const StatesDark: Story = {
  ...States,
  globals: { theme: 'dark' },
};
