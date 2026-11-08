import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { BusIcon, CarIcon, TruckIcon } from 'lucide-react';
import { expect, fn, screen, waitFor } from 'storybook/test';

import { FacetFilter, type FacetFilterProps } from './FacetFilter';
import type { FacetOption } from './FacetList';

const OPTIONS: FacetOption[] = [
  { value: 'car', label: 'Car', icon: CarIcon, count: 12 },
  { value: 'truck', label: 'Truck', icon: TruckIcon, count: 4 },
  { value: 'bus', label: 'Bus', icon: BusIcon, count: 7 },
];

const Controlled: React.FC<FacetFilterProps> = props => {
  const [value, setValue] = useState(props.value);
  return (
    <FacetFilter
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
  title: 'Molecule/FacetFilter',
  component: FacetFilter,
  args: { title: 'Vehicle type', options: OPTIONS, value: [], onChange: fn() },
  render: args => <Controlled {...args} />,
} satisfies Meta<typeof FacetFilter>;

export default meta;

type Story = StoryObj<typeof meta>;

type Canvas = { getByRole: typeof screen.getByRole };
type Interact = { click: (element: Element) => Promise<void> };

const trigger = (canvas: Canvas) => canvas.getByRole('button', { name: /Vehicle type/ });

const open = async (canvas: Canvas, userEvent: Interact) => {
  await userEvent.click(trigger(canvas));
  return screen.findByRole('listbox');
};

// Finish closed: an overlay left closing fails axe, and an open one can leak into the next story.
const close = async (userEvent: { keyboard: (text: string) => Promise<void> }) => {
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
};

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await expect(trigger(canvas)).toHaveTextContent('All');
    await open(canvas, userEvent);
    await userEvent.click(screen.getByRole('option', { name: /Truck/ }));
    await expect(args.onChange).toHaveBeenLastCalledWith(['truck']);
    await expect(trigger(canvas)).toHaveTextContent('1');
    // Stays open so several values can be picked.
    await expect(screen.getByRole('listbox')).toBeInTheDocument();
    await close(userEvent);
  },
};

export const Toggle: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await open(canvas, userEvent);
    const option = screen.getByRole('option', { name: /Truck/ });
    await userEvent.click(option);
    await userEvent.click(option);
    await expect(args.onChange).toHaveBeenLastCalledWith([]);
    await close(userEvent);
  },
};

export const SelectAll: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await open(canvas, userEvent);
    await userEvent.click(screen.getByRole('button', { name: 'Select all' }));
    await expect(args.onChange).toHaveBeenLastCalledWith(['car', 'truck', 'bus']);
    await expect(trigger(canvas)).toHaveTextContent('All');
    await userEvent.click(screen.getByRole('button', { name: 'Select all' }));
    await expect(args.onChange).toHaveBeenLastCalledWith([]);
    await close(userEvent);
  },
};

// Select all acts on every option, so it must not be offered over a filtered list.
export const SelectAllHiddenWhileSearching: Story = {
  play: async ({ canvas, userEvent }) => {
    await open(canvas, userEvent);
    await userEvent.type(screen.getByRole('combobox', { name: 'Vehicle type' }), 'tr');
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Select all' })).toBeNull());
    await close(userEvent);
  },
};

export const Search: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await open(canvas, userEvent);
    await userEvent.type(screen.getByRole('combobox', { name: 'Vehicle type' }), 'bu');
    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(1));
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(args.onChange).toHaveBeenLastCalledWith(['bus']);
    await close(userEvent);
  },
};

export const NoResults: Story = {
  play: async ({ canvas, userEvent }) => {
    await open(canvas, userEvent);
    const search = screen.getByRole('combobox', { name: 'Vehicle type' });
    await userEvent.type(search, 'zzz');
    await expect(await screen.findByText('No results')).toBeInTheDocument();
    await userEvent.clear(search);
    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(3));
    await close(userEvent);
  },
};

export const ClearFilters: Story = {
  args: { value: ['car'] },
  play: async ({ args, canvas, userEvent }) => {
    await open(canvas, userEvent);
    await userEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    await expect(args.onChange).toHaveBeenLastCalledWith([]);
    await close(userEvent);
  },
};

// A stale URL param or a removed option must not count as a selection.
export const StaleValue: Story = {
  args: { value: ['gone'] },
  play: async ({ canvas }) => {
    await expect(trigger(canvas)).toHaveTextContent('All');
  },
};

export const LongLabels: Story = {
  args: {
    options: [{ value: 'a', label: 'A very long vehicle type name that cannot possibly fit here' }],
  },
  play: async ({ canvas, userEvent }) => {
    await open(canvas, userEvent);
    const label = screen.getByText(/A very long vehicle type/);
    await waitFor(() => expect(label.scrollWidth).toBeGreaterThan(label.clientWidth));
    await close(userEvent);
  },
};

export const ReturnsFocus: Story = {
  play: async ({ canvas, userEvent }) => {
    await open(canvas, userEvent);
    await close(userEvent);
    await waitFor(() => expect(trigger(canvas)).toHaveFocus());
  },
};

// Picking several matches from a long list must not mean retyping the search each time.
export const SearchSurvivesPick: Story = {
  play: async ({ canvas, userEvent }) => {
    await open(canvas, userEvent);
    const search = screen.getByRole('combobox', { name: 'Vehicle type' });
    await userEvent.type(search, 'r');
    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(2));
    await userEvent.click(screen.getByRole('option', { name: /Truck/ }));
    await expect(search).toHaveValue('r');
    await expect(screen.getAllByRole('option')).toHaveLength(2);
    await close(userEvent);
  },
};

// A disabled option can't be toggled, not even through Select all.
export const SelectAllKeepsLocked: Story = {
  args: {
    options: [...OPTIONS.slice(0, 2), { value: 'bus', label: 'Bus', disabled: true }],
    value: ['bus'],
  },
  play: async ({ args, canvas, userEvent }) => {
    await open(canvas, userEvent);
    await userEvent.click(screen.getByRole('button', { name: 'Select all' }));
    await expect(args.onChange).toHaveBeenLastCalledWith(['bus', 'car', 'truck']);
    await userEvent.click(screen.getByRole('button', { name: 'Select all' }));
    await expect(args.onChange).toHaveBeenLastCalledWith(['bus']);
    await close(userEvent);
  },
};

export const SelectAllShowsKeyboardFocus: Story = {
  play: async ({ canvas, userEvent }) => {
    await open(canvas, userEvent);
    await waitFor(() =>
      expect(screen.getByRole('combobox', { name: 'Vehicle type' })).toHaveFocus()
    );
    await userEvent.tab();
    const selectAll = screen.getByRole('button', { name: 'Select all' });
    await expect(selectAll).toHaveFocus();
    await waitFor(() =>
      expect(getComputedStyle(selectAll).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    );
    await close(userEvent);
  },
};

// Brand text is only guaranteed on background and card, but the button changes colour on hover
// and while open, so the summary brings its own surface.
export const ActiveSummaryHasOwnSurface: Story = {
  args: { value: ['car'] },
  play: async ({ canvas }) => {
    const summary = canvas.getByText('1');
    await expect(getComputedStyle(summary).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  },
};

// The row's highlight recolours everything inside it; the tick must stay on its checkbox colour.
export const TickKeepsColourOnHover: Story = {
  args: { value: ['car', 'truck'] },
  play: async ({ canvas, userEvent }) => {
    await open(canvas, userEvent);
    const row = screen.getByRole('option', { name: /Truck/ });
    const stroke = () => getComputedStyle(row.querySelector('svg path')!).stroke;
    const resting = stroke();
    await userEvent.hover(row);
    await waitFor(() => expect(row).toHaveAttribute('data-highlighted'));
    await expect(stroke()).toBe(resting);
    await close(userEvent);
  },
};

// Stays open so axe checks the popup and the selected row.
export const Dark: Story = {
  args: { value: ['car'] },
  globals: { theme: 'dark' },
  play: async ({ canvas, userEvent }) => {
    await open(canvas, userEvent);
    await waitFor(() => expect(screen.getByRole('listbox')).toBeVisible());
  },
};
