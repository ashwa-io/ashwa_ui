import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, fn, screen, waitFor } from 'storybook/test';

import { Select, type SelectOption, type SelectProps } from './Select';

const CATEGORIES: SelectOption[] = [
  { value: 'car', label: 'Car' },
  { value: 'truck', label: 'Truck' },
  { value: 'bus', label: 'Bus', disabled: true },
];

const Controlled: React.FC<SelectProps> = props => {
  const [value, setValue] = useState(props.value);
  return (
    <Select
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
  title: 'Atomic/Select',
  component: Select,
  args: {
    label: 'Category',
    options: CATEGORIES,
    value: null,
    onChange: fn(),
    placeholder: 'Select a category',
  },
  render: args => <Controlled {...args} />,
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

// Stories that close the list finish after it unmounts: mid-close, Floating UI's focus guards
// are aria-hidden yet focusable, so the a11y check fails intermittently.
const listClosed = () => waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole('combobox', { name: 'Category' });
    await expect(trigger).toHaveTextContent('Select a category');
    await userEvent.click(trigger);
    // The list renders in a portal, outside the story canvas.
    await userEvent.click(await screen.findByRole('option', { name: 'Truck' }));
    await expect(args.onChange).toHaveBeenCalledWith('truck');
    await expect(trigger).toHaveTextContent('Truck');
    await listClosed();
  },
};

// The trigger shows the option's label, never its raw value.
export const ShowsLabel: Story = {
  args: { value: 'truck' },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('combobox', { name: 'Category' });
    await expect(trigger).toHaveTextContent('Truck');
    await expect(trigger).not.toHaveTextContent('truck');
  },
};

export const WithError: Story = {
  args: { required: true, error: 'Please pick a category' },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('combobox', { name: 'Category' });
    await expect(trigger).toHaveAttribute('aria-invalid', 'true');
    await expect(trigger).toHaveAccessibleDescription('Please pick a category');
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('combobox', { name: 'Category' });
    await fireEvent.click(trigger);
    await expect(screen.queryByRole('listbox')).toBeNull();
  },
};

export const Dark: Story = {
  args: { value: 'car' },
  globals: { theme: 'dark' },
};

// Opening the list moves focus into it; that is not a blur of the field (react-hook-form onBlur).
export const BlurOnlyWhenLeaving: Story = {
  args: { onBlur: fn() },
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole('combobox', { name: 'Category' });
    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole('option', { name: 'Car' }));
    await listClosed();
    await waitFor(() => expect(trigger).toHaveFocus());
    await expect(args.onBlur).not.toHaveBeenCalled();
    await userEvent.tab();
    await expect(args.onBlur).toHaveBeenCalledOnce();
  },
};

// Clicking outside the open list leaves the field: that is a blur.
export const BlurOnOutsideClick: Story = {
  args: { onBlur: fn() },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('combobox', { name: 'Category' }));
    await screen.findByRole('listbox');
    await userEvent.click(document.body);
    // Can fire twice: Base UI may return focus to the trigger, which then blurs. Harmless for forms.
    await expect(args.onBlur).toHaveBeenCalled();
    await listClosed();
  },
};
