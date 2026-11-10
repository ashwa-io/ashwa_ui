import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, waitFor } from 'storybook/test';

import { DateRangeInput } from './DateRangeInput';
import type { DateRangeInputProps } from './DateRangeInput';
import { dateRangePresets } from './dateRangePresets';

const Controlled: React.FC<DateRangeInputProps> = props => {
  const [value, setValue] = useState(props.value);

  return (
    <DateRangeInput
      {...props}
      value={value}
      onChange={next => {
        setValue(next);
        props.onChange(next);
      }}
    />
  );
};

const NAME = /Trip dates/;
const EMPTY = { from: null, to: null };
const NOVEMBER = { from: '2026-11-01', to: '2026-11-10' };

const day = (n: number) => new RegExp(`^${n} November 2026`);

type Interact = { keyboard: (text: string) => Promise<void> };

// Finish closed: an overlay left closing fails axe, and an open one can leak into the next story.
const close = async (userEvent: Interact) => {
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
};

const meta = {
  title: 'Molecule/DateRangeInput',
  component: DateRangeInput,
  args: {
    label: 'Trip dates',
    value: EMPTY,
    onChange: fn(),
    // A fixed today, so the presets give the same dates on any day the tests run.
    presets: dateRangePresets(() => '2026-11-10'),
  },
  render: args => <Controlled {...args} />,
  decorators: [Story => <div className="w-72">{Story()}</div>],
} satisfies Meta<typeof DateRangeInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: NAME })).toHaveTextContent('Pick a date range');
  },
};

// Screen readers hear the field's name and its value together.
export const ShowsValue: Story = {
  args: { value: NOVEMBER },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: 'Trip dates 1 Nov 2026 – 10 Nov 2026' })
    ).toHaveTextContent('1 Nov 2026 – 10 Nov 2026');
  },
};

export const PresetAppliesAndCloses: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: NAME });
    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole('button', { name: 'Last 7 days' }));
    await expect(args.onChange).toHaveBeenCalledWith({ from: '2026-11-04', to: '2026-11-10' });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(trigger).toHaveTextContent('4 Nov 2026 – 10 Nov 2026');
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const MatchingPresetIsPressed: Story = {
  args: { value: { from: '2026-10-01', to: '2026-10-31' } },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: NAME }));
    await expect(await screen.findByRole('button', { name: 'Last month' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    await expect(screen.getByRole('button', { name: 'Today' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
    await expect(screen.queryByText('Custom')).toBeNull();
    await close(userEvent);
  },
};

export const OtherDatesShowCustom: Story = {
  args: { value: { from: '2026-11-02', to: '2026-11-05' } },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: NAME }));
    const custom = await screen.findByText('Custom');
    // The popup fades in.
    await waitFor(() => expect(custom).toBeVisible());
    await close(userEvent);
  },
};

// Nothing changes until Apply, so a half-picked range never reaches the app.
export const PicksRangeThenApplies: Story = {
  args: { value: NOVEMBER },
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: NAME });
    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole('button', { name: day(15) }));
    await expect(args.onChange).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }));
    await expect(args.onChange).toHaveBeenCalledWith({ from: '2026-11-01', to: '2026-11-15' });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(trigger).toHaveTextContent('1 Nov 2026 – 15 Nov 2026');
  },
};

export const OneDayAppliesAsFromAndTo: Story = {
  args: { min: '2026-11-01', max: '2026-11-30' },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: NAME }));
    await expect(await screen.findByRole('button', { name: 'Apply' })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: day(12) }));
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }));
    await expect(args.onChange).toHaveBeenCalledWith({ from: '2026-11-12', to: '2026-11-12' });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  },
};

export const ClosingDropsUnappliedDates: Story = {
  args: { value: NOVEMBER },
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: NAME });
    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole('button', { name: day(15) }));
    await close(userEvent);
    await expect(args.onChange).not.toHaveBeenCalled();
    await expect(trigger).toHaveTextContent('1 Nov 2026 – 10 Nov 2026');
    await userEvent.click(trigger);
    await expect(await screen.findByRole('button', { name: day(15) })).not.toHaveAccessibleName(
      /selected/
    );
    await close(userEvent);
  },
};

export const Clears: Story = {
  args: { value: NOVEMBER },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: NAME }));
    await userEvent.click(await screen.findByRole('button', { name: 'Clear' }));
    await expect(args.onChange).toHaveBeenCalledWith(EMPTY);
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(canvas.getByRole('button', { name: NAME })).toHaveTextContent('Pick a date range');
  },
};

export const NoClearWhenRequired: Story = {
  args: { value: NOVEMBER, required: true },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole('button', { name: /required/ })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: NAME }));
    await screen.findByRole('dialog');
    await expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();
    await close(userEvent);
  },
};

// For a range that must stay set once picked.
export const NotClearable: Story = {
  args: { value: NOVEMBER, clearable: false },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: NAME }));
    await screen.findByRole('dialog');
    await expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();
    await close(userEvent);
  },
};

// A preset that reaches outside min/max can't be picked, like the days themselves.
export const MinMaxLimitPresetsAndDays: Story = {
  args: { value: NOVEMBER, min: '2026-11-01', max: '2026-11-10' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: NAME }));
    await expect(await screen.findByRole('button', { name: 'Last month' })).toBeDisabled();
    await expect(screen.getByRole('button', { name: 'Last 30 days' })).toBeDisabled();
    await expect(screen.getByRole('button', { name: 'Last 7 days' })).toBeEnabled();
    await expect(screen.getByRole('button', { name: day(11) })).toBeDisabled();
    await close(userEvent);
  },
};

export const NoPresets: Story = {
  args: { value: NOVEMBER, presets: [], numberOfMonths: 1 },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: NAME }));
    await expect(await screen.findAllByRole('grid')).toHaveLength(1);
    await expect(screen.queryByRole('group', { name: 'Presets' })).toBeNull();
    await close(userEvent);
  },
};

export const TwoMonthsByDefault: Story = {
  args: { value: NOVEMBER },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: NAME }));
    await waitFor(() => expect(screen.getAllByRole('grid')).toHaveLength(2));
    await close(userEvent);
  },
};

export const KeyboardMovesBetweenDays: Story = {
  args: { value: NOVEMBER },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: NAME }));
    const start = await screen.findByRole('button', { name: day(1) });
    start.focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(screen.getByRole('button', { name: day(2) })).toHaveFocus());
    await close(userEvent);
  },
};

export const CallsOnBlurWhenClosed: Story = {
  args: { value: NOVEMBER, onBlur: fn() },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: NAME }));
    await screen.findByRole('dialog');
    await waitFor(() =>
      expect(screen.getByRole('dialog')).toContainElement(document.activeElement as HTMLElement)
    );
    await close(userEvent);
    await expect(args.onBlur).toHaveBeenCalledOnce();
  },
};

export const InvalidValueIsEmpty: Story = {
  args: { value: { from: 'nope', to: '2026-11-10' } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: NAME })).toHaveTextContent('Pick a date range');
  },
};

export const WithError: Story = {
  args: { error: 'Pick the trip dates first' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: NAME })).toHaveAttribute(
      'aria-invalid',
      'true'
    );
    await expect(canvas.getByText('Pick the trip dates first')).toBeVisible();
  },
};

export const HiddenLabelKeepsName: Story = {
  args: { hideLabel: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: NAME })).toBeVisible();
  },
};

export const Disabled: Story = {
  args: { disabled: true, value: NOVEMBER },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: NAME })).toBeDisabled();
  },
};

export const Small: Story = {
  args: { size: 'sm', value: NOVEMBER },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: NAME })).toBeVisible();
  },
};

export const Dark: Story = {
  args: { value: { from: '2026-11-02', to: '2026-11-05' } },
  globals: { theme: 'dark' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: NAME }));
    const [grid] = await screen.findAllByRole('grid');
    await waitFor(() => expect(grid).toBeVisible());
  },
};
