import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, fn, waitFor } from 'storybook/test';

import { RadioGroup } from './RadioGroup';
import type { RadioGroupProps, RadioOption } from './RadioGroup';

const options: RadioOption[] = [
  { value: 'free', label: 'Go back to inventory' },
  { value: 'scrap', label: 'Mark as scrapped', description: 'This cannot be undone.' },
  { value: 'lost', label: 'Mark as lost', disabled: true },
];

const Controlled: React.FC<RadioGroupProps> = props => {
  const [value, setValue] = useState(props.value);

  return (
    <RadioGroup
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
  title: 'Atomic/RadioGroup',
  component: RadioGroup,
  args: { label: 'Old device will', value: 'free', onChange: fn(), options },
  render: args => <Controlled {...args} />,
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('radiogroup', { name: 'Old device will' })).toBeVisible();
    await expect(canvas.getByRole('radio', { name: /Go back to inventory/ })).toBeChecked();
    await expect(canvas.getAllByRole('radio')).toHaveLength(3);
  },
};

export const NoSelection: Story = {
  args: { value: null },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('radio', { name: /Go back to inventory/ })).not.toBeChecked();
  },
};

export const Selects: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByText('Mark as scrapped'));
    await expect(args.onChange).toHaveBeenCalledWith('scrap');
    await waitFor(() =>
      expect(canvas.getByRole('radio', { name: /Mark as scrapped/ })).toBeChecked()
    );
  },
};

export const KeyboardMoves: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('radio', { name: /Go back to inventory/ })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(args.onChange).toHaveBeenCalledWith('scrap'));
  },
};

export const DisabledOption: Story = {
  play: async ({ args, canvas }) => {
    const radio = canvas.getByRole('radio', { name: /Mark as lost/ });
    await expect(radio).toHaveAttribute('aria-disabled', 'true');
    await fireEvent.click(radio);
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};

export const WithDescription: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('This cannot be undone.')).toBeVisible();
    await expect(
      canvas.getByRole('radio', { name: /Mark as scrapped/ })
    ).toHaveAccessibleDescription('This cannot be undone.');
  },
};

export const WithError: Story = {
  args: { value: null, error: 'Choose one' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('radiogroup')).toHaveAttribute('aria-invalid', 'true');
    await expect(canvas.getByText('Choose one')).toBeVisible();
  },
};

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    options: [
      { value: 'free', label: 'Free' },
      { value: 'scrap', label: 'Scrap' },
    ],
  },
  play: async ({ canvas }) => {
    const free = canvas.getByRole('radio', { name: 'Free' }).getBoundingClientRect();
    const scrap = canvas.getByRole('radio', { name: 'Scrap' }).getBoundingClientRect();
    await expect(free.top).toBe(scrap.top);
  },
};

export const Dark: Story = {
  globals: { theme: 'dark' },
};

export const DisabledOptionLooksDisabled: Story = {
  play: async ({ canvas }) => {
    const radio = canvas.getByRole('radio', { name: /Mark as lost/ });
    await waitFor(() => expect(getComputedStyle(radio).opacity).toBe('0.5'));
  },
};

export const DisabledGroupLooksDisabled: Story = {
  args: { disabled: true },
  // Disabled controls are exempt from contrast (WCAG 1.4.3); axe can't tie this label to them.
  parameters: { a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } } },
  play: async ({ canvas }) => {
    const radio = canvas.getByRole('radio', { name: /Go back to inventory/ });
    await waitFor(() => expect(getComputedStyle(radio).opacity).toBe('0.5'));
    await expect(getComputedStyle(canvas.getByText('Go back to inventory')).cursor).not.toBe(
      'pointer'
    );
  },
};
