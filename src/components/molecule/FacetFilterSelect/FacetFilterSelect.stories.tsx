import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, waitFor } from 'storybook/test';

import { FacetFilterSelect, type FacetFilterSelectProps } from './FacetFilterSelect';

const Controlled: React.FC<FacetFilterSelectProps> = props => {
  const [value, setValue] = useState(props.value);
  return (
    <FacetFilterSelect
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
  title: 'Molecule/FacetFilterSelect',
  component: FacetFilterSelect,
  args: {
    title: 'Work shift',
    options: [
      { value: 'morning', label: 'Morning' },
      { value: 'evening', label: 'Evening' },
    ],
    value: null,
    onChange: fn(),
  },
  render: args => <Controlled {...args} />,
} satisfies Meta<typeof FacetFilterSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

type Canvas = { getByRole: typeof screen.getByRole };

const trigger = (canvas: Canvas) => canvas.getByRole('button', { name: /Work shift/ });
const closed = () => waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await expect(trigger(canvas)).toHaveTextContent('All');
    await userEvent.click(trigger(canvas));
    // One choice only, so screen readers must not announce a multi-select list.
    await expect(await screen.findByRole('listbox')).not.toHaveAttribute(
      'aria-multiselectable',
      'true'
    );
    await userEvent.click(screen.getByRole('option', { name: 'Morning' }));
    await expect(args.onChange).toHaveBeenLastCalledWith('morning');
    await closed();
    await expect(trigger(canvas)).toHaveTextContent('Morning');
  },
};

export const ReplacesChoice: Story = {
  args: { value: 'morning' },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(trigger(canvas));
    await userEvent.click(await screen.findByRole('option', { name: 'Evening' }));
    await expect(args.onChange).toHaveBeenLastCalledWith('evening');
    await closed();
  },
};

export const ClearsOnSecondPick: Story = {
  args: { value: 'morning' },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(trigger(canvas));
    await userEvent.click(await screen.findByRole('option', { name: 'Morning' }));
    await expect(args.onChange).toHaveBeenLastCalledWith(null);
    await closed();
    await expect(trigger(canvas)).toHaveTextContent('All');
  },
};

export const Required: Story = {
  args: { value: 'morning', required: true },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(trigger(canvas));
    await screen.findByRole('listbox');
    await expect(screen.queryByRole('button', { name: 'Clear filters' })).toBeNull();
    await userEvent.click(screen.getByRole('option', { name: 'Morning' }));
    await expect(args.onChange).not.toHaveBeenCalled();
    await closed();
    await expect(trigger(canvas)).toHaveTextContent('Morning');
  },
};

export const StaleValue: Story = {
  args: { value: 'gone' },
  play: async ({ canvas }) => {
    await expect(trigger(canvas)).toHaveTextContent('All');
  },
};

// Stays open so axe checks the popup and the selected row.
export const Dark: Story = {
  args: { value: 'morning' },
  globals: { theme: 'dark' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(trigger(canvas));
    await waitFor(() => expect(screen.getByRole('listbox')).toBeVisible());
  },
};
