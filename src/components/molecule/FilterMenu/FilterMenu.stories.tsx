import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, waitFor } from 'storybook/test';

import { FilterMenu, type FilterCategory, type FilterMenuProps } from './FilterMenu';

const CATEGORIES: FilterCategory[] = [
  {
    id: 'school',
    label: 'School',
    options: [
      { value: 'oakridge', label: 'Oakridge High School' },
      { value: 'green', label: 'Green School' },
    ],
  },
  {
    id: 'house',
    label: 'House',
    options: [
      { value: 'red', label: 'Red house' },
      { value: 'blue', label: 'Blue house' },
    ],
  },
  {
    id: 'status',
    label: 'Status',
    multiple: false,
    options: [
      { value: 'active', label: 'Active' },
      { value: 'paused', label: 'Paused' },
    ],
  },
];

const EMPTY = { school: [], house: [], status: [] };

const Controlled: React.FC<FilterMenuProps> = props => {
  const [value, setValue] = useState(props.value);
  return (
    <FilterMenu
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
  title: 'Molecule/FilterMenu',
  component: FilterMenu,
  args: { categories: CATEGORIES, value: EMPTY, onChange: fn() },
  render: args => <Controlled {...args} />,
} satisfies Meta<typeof FilterMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

type Canvas = { getByRole: typeof screen.getByRole };
type Interact = { click: (element: Element) => Promise<void> };
type Keys = { keyboard: (text: string) => Promise<void> };

const trigger = (canvas: Canvas) => canvas.getByRole('button', { name: /^Filter/ });

const open = async (canvas: Canvas, userEvent: Interact) => {
  await userEvent.click(trigger(canvas));
  await screen.findByRole('dialog', { name: 'Filter' });
};

const openCategory = async (name: string, userEvent: Interact) => {
  await userEvent.click(screen.getByRole('button', { name: new RegExp(`^${name}`) }));
  return screen.findByRole('listbox');
};

const closeAll = async (userEvent: Keys) => {
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
};

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await expect(trigger(canvas)).toHaveAccessibleName('Filter');
    await open(canvas, userEvent);
    await openCategory('School', userEvent);
    await userEvent.click(screen.getByRole('option', { name: 'Oakridge High School' }));
    await expect(args.onChange).toHaveBeenLastCalledWith({ ...EMPTY, school: ['oakridge'] });
    await expect(trigger(canvas)).toHaveAccessibleName('Filter 1 active');
    await closeAll(userEvent);
  },
};

export const SearchCategories: Story = {
  play: async ({ canvas, userEvent }) => {
    await open(canvas, userEvent);
    await userEvent.type(screen.getByRole('textbox', { name: 'Search filters' }), 'hou');
    await expect(screen.getByRole('button', { name: /^House/ })).toBeInTheDocument();
    await expect(screen.queryByRole('button', { name: /^School/ })).toBeNull();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  },
};

export const SingleChoiceCategory: Story = {
  args: { value: { ...EMPTY, status: ['active'] } },
  play: async ({ args, canvas, userEvent }) => {
    await open(canvas, userEvent);
    await openCategory('Status', userEvent);
    await userEvent.click(screen.getByRole('option', { name: 'Paused' }));
    await expect(args.onChange).toHaveBeenLastCalledWith({ ...EMPTY, status: ['paused'] });
    await closeAll(userEvent);
  },
};

export const ClearAll: Story = {
  args: { value: { ...EMPTY, school: ['green'], house: ['red'] } },
  play: async ({ args, canvas, userEvent }) => {
    await expect(trigger(canvas)).toHaveAccessibleName('Filter 2 active');
    await open(canvas, userEvent);
    await userEvent.click(screen.getByRole('button', { name: 'Clear all' }));
    await expect(args.onChange).toHaveBeenLastCalledWith(EMPTY);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  },
};

// Other filters kept in the same object (e.g. from the URL) are never dropped.
export const KeepsUnknownKeys: Story = {
  args: { value: { ...EMPTY, other: ['x'] } },
  play: async ({ args, canvas, userEvent }) => {
    await expect(trigger(canvas)).toHaveAccessibleName('Filter');
    await open(canvas, userEvent);
    await openCategory('House', userEvent);
    await userEvent.click(screen.getByRole('option', { name: 'Blue house' }));
    await expect(args.onChange).toHaveBeenLastCalledWith({
      ...EMPTY,
      other: ['x'],
      house: ['blue'],
    });
    await closeAll(userEvent);
  },
};

// Escape steps back one level at a time, and focus lands where the user was.
export const EscapeClosesOneLevel: Story = {
  play: async ({ canvas, userEvent }) => {
    await open(canvas, userEvent);
    await openCategory('School', userEvent);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    await expect(screen.getByRole('dialog', { name: 'Filter' })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('button', { name: /^School/ })).toHaveFocus());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(trigger(canvas)).toHaveFocus());
  },
};

// Stays open so axe checks both panels and a selected row.
export const Dark: Story = {
  args: { value: { ...EMPTY, school: ['green'] } },
  globals: { theme: 'dark' },
  play: async ({ canvas, userEvent }) => {
    await open(canvas, userEvent);
    await openCategory('School', userEvent);
    await waitFor(() => expect(screen.getByRole('listbox')).toBeVisible());
  },
};
