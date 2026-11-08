import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, waitFor } from 'storybook/test';

import {
  FacetFilterNumber,
  type FacetFilterNumberProps,
  type NumberCondition,
} from './FacetFilterNumber';

const CONDITIONS: NumberCondition[] = [
  { value: 'gt', label: 'Greater than' },
  { value: 'lt', label: 'Less than' },
  { value: 'between', label: 'Between', range: true },
];

const Controlled: React.FC<FacetFilterNumberProps> = props => {
  const [value, setValue] = useState(props.value);
  return (
    <FacetFilterNumber
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
  title: 'Molecule/FacetFilterNumber',
  component: FacetFilterNumber,
  args: { title: 'Speed', conditions: CONDITIONS, value: null, onChange: fn() },
  render: args => <Controlled {...args} />,
} satisfies Meta<typeof FacetFilterNumber>;

export default meta;

type Story = StoryObj<typeof meta>;

type Canvas = { getByRole: typeof screen.getByRole };
type Interact = { click: (element: Element) => Promise<void> };

const trigger = (canvas: Canvas) => canvas.getByRole('button', { name: /Speed/ });

const open = async (canvas: Canvas, userEvent: Interact) => {
  await userEvent.click(trigger(canvas));
  await screen.findByRole('dialog', { name: 'Speed' });
};

const pickCondition = async (userEvent: Interact, name: string) => {
  await userEvent.click(screen.getByRole('combobox', { name: 'Condition' }));
  await userEvent.click(await screen.findByRole('option', { name }));
  await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
};

const close = async (userEvent: { keyboard: (text: string) => Promise<void> }) => {
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
};

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await expect(trigger(canvas)).toHaveTextContent('All');
    await open(canvas, userEvent);
    await pickCondition(userEvent, 'Greater than');
    // Picking from the nested list must not close the filter's own popup.
    await expect(screen.getByRole('dialog', { name: 'Speed' })).toBeInTheDocument();
    await expect(trigger(canvas)).toHaveTextContent('Greater than');
    await userEvent.type(screen.getByRole('spinbutton', { name: 'Value' }), '60');
    await expect(args.onChange).toHaveBeenLastCalledWith({ condition: 'gt', from: '60', to: '' });
    await expect(trigger(canvas)).toHaveTextContent('Greater than 60');
    await close(userEvent);
  },
};

export const Range: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await open(canvas, userEvent);
    await pickCondition(userEvent, 'Between');
    await userEvent.type(screen.getByRole('spinbutton', { name: 'From' }), '10');
    await userEvent.type(screen.getByRole('spinbutton', { name: 'To' }), '20');
    await expect(args.onChange).toHaveBeenLastCalledWith({
      condition: 'between',
      from: '10',
      to: '20',
    });
    await expect(trigger(canvas)).toHaveTextContent('Between 10 and 20');
    await close(userEvent);
  },
};

export const ConditionChangeClearsTo: Story = {
  args: { value: { condition: 'between', from: '10', to: '20' } },
  play: async ({ args, canvas, userEvent }) => {
    await open(canvas, userEvent);
    await pickCondition(userEvent, 'Less than');
    await expect(args.onChange).toHaveBeenLastCalledWith({ condition: 'lt', from: '10', to: '' });
    await close(userEvent);
  },
};

export const Formats: Story = {
  args: {
    value: { condition: 'gt', from: '60', to: '' },
    format: (value: string) => `${value} km/h`,
  },
  play: async ({ canvas }) => {
    await expect(trigger(canvas)).toHaveTextContent('Greater than 60 km/h');
  },
};

export const Clear: Story = {
  args: { value: { condition: 'gt', from: '60', to: '' } },
  play: async ({ args, canvas, userEvent }) => {
    await open(canvas, userEvent);
    await userEvent.click(screen.getByRole('button', { name: 'Clear filter' }));
    await expect(args.onChange).toHaveBeenLastCalledWith(null);
    await expect(trigger(canvas)).toHaveTextContent('All');
    await close(userEvent);
  },
};

// A condition removed from the list must not show as an active filter.
export const StaleCondition: Story = {
  args: { value: { condition: 'gone', from: '5', to: '' } },
  play: async ({ canvas }) => {
    await expect(trigger(canvas)).toHaveTextContent('All');
  },
};

// Stays open so axe checks the popup.
export const Dark: Story = {
  args: { value: { condition: 'between', from: '10', to: '20' } },
  globals: { theme: 'dark' },
  play: async ({ canvas, userEvent }) => {
    await open(canvas, userEvent);
    await waitFor(() => expect(screen.getByRole('dialog', { name: 'Speed' })).toBeVisible());
  },
};
