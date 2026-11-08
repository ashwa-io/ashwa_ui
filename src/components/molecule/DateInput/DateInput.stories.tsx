import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, waitFor } from 'storybook/test';

import { DateInput } from './DateInput';
import type { DateInputProps } from './DateInput';

const Controlled: React.FC<DateInputProps> = props => {
  const [value, setValue] = useState(props.value);

  return (
    <DateInput
      {...props}
      value={value}
      onChange={next => {
        setValue(next);
        props.onChange(next);
      }}
    />
  );
};

const NAME = /Warranty expiry date/;

const meta = {
  title: 'Molecule/DateInput',
  component: DateInput,
  args: { label: 'Warranty expiry date', value: null, onChange: fn() },
  render: args => <Controlled {...args} />,
  decorators: [Story => <div className="w-64">{Story()}</div>],
} satisfies Meta<typeof DateInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: NAME })).toHaveTextContent('Pick a date');
  },
};

// Screen readers hear the field's name and its value together.
export const ShowsValue: Story = {
  args: { value: '2026-11-08' },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: 'Warranty expiry date 8 Nov 2026' })
    ).toHaveTextContent('8 Nov 2026');
  },
};

export const PicksAndCloses: Story = {
  args: { value: '2026-11-08' },
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: NAME });
    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole('button', { name: /^15 November 2026/ }));
    await expect(args.onChange).toHaveBeenCalledWith('2026-11-15');
    await waitFor(() => expect(screen.queryByRole('grid')).toBeNull());
    await expect(trigger).toHaveTextContent('15 Nov 2026');
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const Clears: Story = {
  args: { value: '2026-11-08' },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: NAME }));
    await userEvent.click(await screen.findByRole('button', { name: 'Clear' }));
    await expect(args.onChange).toHaveBeenCalledWith(null);
    await waitFor(() => expect(screen.queryByRole('grid')).toBeNull());
    await expect(canvas.getByRole('button', { name: NAME })).toHaveTextContent('Pick a date');
  },
};

export const NoClearWhenRequired: Story = {
  args: { value: '2026-11-08', required: true },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: NAME }));
    await screen.findByRole('grid');
    await waitFor(() =>
      expect(screen.getByRole('dialog')).toContainElement(document.activeElement as HTMLElement)
    );
    await expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('grid')).toBeNull());
  },
};

export const CallsOnBlurWhenClosed: Story = {
  args: { value: '2026-11-08', onBlur: fn() },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: NAME }));
    await screen.findByRole('grid');
    await waitFor(() =>
      expect(screen.getByRole('dialog')).toContainElement(document.activeElement as HTMLElement)
    );
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('grid')).toBeNull());
    await expect(args.onBlur).toHaveBeenCalledOnce();
  },
};

export const InvalidValueIsEmpty: Story = {
  args: { value: 'nope' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: NAME })).toHaveTextContent('Pick a date');
  },
};

export const WithError: Story = {
  args: { error: 'Pick a date first' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: NAME })).toHaveAttribute(
      'aria-invalid',
      'true'
    );
    await expect(canvas.getByText('Pick a date first')).toBeVisible();
  },
};

export const HiddenLabelKeepsName: Story = {
  args: { hideLabel: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: NAME })).toBeVisible();
  },
};

export const Disabled: Story = {
  args: { disabled: true, value: '2026-11-08' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: NAME })).toBeDisabled();
  },
};

export const Dark: Story = {
  args: { value: '2026-11-08' },
  globals: { theme: 'dark' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: NAME }));
    const grid = await screen.findByRole('grid');
    await waitFor(() => expect(grid).toBeVisible());
  },
};
