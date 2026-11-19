import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import { EventCalendar } from './EventCalendar';
import type { EventCalendarEvent } from './EventCalendar';

const at = (iso: string) => new Date(iso);

// Instants. 18:45 UTC on the 10th is 00:15 on the 11th in India and 13:45 on the 10th in New York.
const events: EventCalendarEvent[] = [
  {
    id: 'insurance',
    title: 'Insurance due',
    start: at('2026-11-10T18:45:00Z'),
    end: at('2026-11-10T19:45:00Z'),
    tone: 'danger',
    resourceId: 'v1',
  },
  {
    id: 'service',
    title: 'Service at 40,000 km',
    start: at('2026-11-12T04:30:00Z'),
    end: at('2026-11-12T06:30:00Z'),
    tone: 'warning',
    resourceId: 'v2',
  },
  {
    id: 'booking',
    title: 'Booking: Raipur to Korba',
    start: at('2026-11-16T03:30:00Z'),
    end: at('2026-11-16T12:30:00Z'),
    tone: 'brand',
    resourceId: 'v1',
  },
  {
    id: 'fuel',
    title: 'Fuel fill 42 L',
    start: at('2026-11-18T08:00:00Z'),
    end: at('2026-11-18T08:30:00Z'),
    tone: 'neutral',
    resourceId: 'v2',
  },
];

const resources = [
  { id: 'v1', title: 'CG04 AB 1234' },
  { id: 'v2', title: 'CG07 XY 9876' },
];

const meta = {
  title: 'Molecule/EventCalendar',
  component: EventCalendar,
  args: {
    events,
    defaultDate: at('2026-11-15T06:00:00Z'),
    timeZone: 'Asia/Kolkata',
    'aria-label': 'Fleet calendar',
    onEventClick: fn(),
    onRangeChange: fn(),
    onViewChange: fn(),
  },
} satisfies Meta<typeof EventCalendar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Month: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByText('Service at 40,000 km'));
    await waitFor(() =>
      expect(args.onEventClick).toHaveBeenCalledWith(expect.objectContaining({ id: 'service' }))
    );
    expect(args.onRangeChange).toHaveBeenCalled();
  },
};

export const Dark: Story = { globals: { theme: 'dark' } };

export const Week: Story = { args: { defaultView: 'week' } };

export const Agenda: Story = {
  args: { defaultView: 'agenda' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('Booking: Raipur to Korba')).toBeVisible();
  },
};

export const ByVehicle: Story = {
  args: { views: ['resource', 'month'], resources, defaultDate: at('2026-11-16T06:00:00Z') },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('CG04 AB 1234')).toBeVisible();
  },
};

// The same instant lands on the 11th in India and on the 10th in New York.
export const IndiaTime: Story = {
  args: {
    views: ['agenda'],
    events: [events[0]],
    timeZone: 'Asia/Kolkata',
    defaultDate: at('2026-11-10T06:00:00Z'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText(/November 11, 2026/)).toBeVisible();
  },
};

export const NewYorkTime: Story = {
  args: {
    views: ['agenda'],
    events: [events[0]],
    timeZone: 'America/New_York',
    defaultDate: at('2026-11-10T18:00:00Z'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText(/November 10, 2026/)).toBeVisible();
  },
};

// A busy calendar is dimmed and takes no input, like a disabled control, so its contrast is not judged.
export const Loading: Story = {
  args: { loading: true },
  parameters: { a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } } },
};

export const Empty: Story = { args: { events: [], defaultView: 'agenda' } };
