import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { TextArea, type TextAreaProps } from './TextArea';

const Controlled: React.FC<TextAreaProps> = props => {
  const [value, setValue] = useState(props.value);
  return (
    <TextArea
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
  title: 'Atomic/TextArea',
  component: TextArea,
  args: { label: 'Description', value: '', onChange: fn(), placeholder: 'What this role is for' },
  render: args => <Controlled {...args} />,
} satisfies Meta<typeof TextArea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const textarea = canvas.getByRole('textbox', { name: 'Description' });
    await expect(textarea).toHaveAttribute('rows', '3');
    await userEvent.type(textarea, 'Fleet admins');
    await expect(args.onChange).toHaveBeenLastCalledWith('Fleet admins');
  },
};

export const WithError: Story = {
  args: { error: 'Description is required' },
  play: async ({ canvas }) => {
    const textarea = canvas.getByRole('textbox', { name: 'Description' });
    await expect(textarea).toHaveAttribute('aria-invalid', 'true');
    await expect(textarea).toHaveAccessibleDescription('Description is required');
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
    await expect(canvas.getByRole('textbox', { name: 'Disabled' })).toBeDisabled();
    const readOnly = canvas.getByRole('textbox', { name: 'Read only' });
    await userEvent.type(readOnly, 'x');
    await expect(readOnly).toHaveValue('Fixed');
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};

export const StatesDark: Story = {
  ...States,
  globals: { theme: 'dark' },
};
