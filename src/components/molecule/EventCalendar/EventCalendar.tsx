import { useMemo } from 'react';

import { EventCalendar as EventCalendarRoot } from '@/components/reui/event-calendar/event-calendar';
import { EventCalendarContent } from '@/components/reui/event-calendar/event-calendar-content';
import { EventCalendarNav } from '@/components/reui/event-calendar/event-calendar-nav';
import type { Tone } from '@/lib/types';
import { cn } from '@/lib/utils';

export type EventCalendarView = 'month' | 'week' | 'day' | 'agenda' | 'resource';

export interface EventCalendarEvent {
  id: string;
  title: string;
  /** An instant. The calendar places it on a day using `timeZone`. */
  start: Date;
  /** Exclusive; never before `start`. */
  end: Date;
  /** Start and end must be midnights in `timeZone`. */
  allDay?: boolean;
  tone?: Tone;
  /** Row of the resource view this event sits in. */
  resourceId?: string;
}

export interface EventCalendarResource {
  id: string;
  title: string;
}

export interface EventCalendarRange {
  start: Date;
  /** Exclusive. */
  end: Date;
}

export interface EventCalendarProps {
  events: EventCalendarEvent[];
  view?: EventCalendarView;
  defaultView?: EventCalendarView;
  onViewChange?: (view: EventCalendarView) => void;
  /** Any instant inside the period on screen. */
  date?: Date;
  defaultDate?: Date;
  onDateChange?: (date: Date) => void;
  /** Views offered in the switcher. One view hides the switcher. */
  views?: EventCalendarView[];
  /** IANA zone the days are cut in, such as `Asia/Kolkata`. Defaults to the viewer's zone. */
  timeZone?: string;
  /** 0 is Sunday. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Rows of the resource view. */
  resources?: EventCalendarResource[];
  loading?: boolean;
  /** `fill` takes the height of its container, which must have one. */
  size?: 'sm' | 'md' | 'lg' | 'fill';
  onEventClick?: (event: EventCalendarEvent) => void;
  /** The days now on screen, outside days included: load events for this range. */
  onRangeChange?: (range: EventCalendarRange) => void;
  id?: string;
  'aria-label'?: string;
  'data-testid'?: string;
}

const DEFAULT_VIEWS: EventCalendarView[] = ['month', 'week', 'day', 'agenda'];

// Status fills, so an event reads the same as a Badge of the same tone.
const TONE_COLOR: Record<Tone, string> = {
  neutral: 'var(--color-muted-foreground)',
  brand: 'var(--color-brand)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  danger: 'var(--color-destructive)',
  info: 'var(--color-info)',
};

const SIZE_CLASS: Record<NonNullable<EventCalendarProps['size']>, string> = {
  sm: 'h-[480px]',
  md: 'h-[640px]',
  lg: 'h-[800px]',
  fill: 'h-full',
};

// Read only: the calendar shows what other screens own, it never moves or creates an event.
const NO_INTERACTIONS = { drag: false, resize: false, selectSlot: false };

export const EventCalendar: React.FC<EventCalendarProps> = props => {
  const { events, view, defaultView, onViewChange, date, defaultDate, onDateChange } = props;
  const { views = DEFAULT_VIEWS, timeZone, weekStartsOn, resources, loading, size = 'md' } = props;
  const { onEventClick, onRangeChange, id } = props;

  const calendarEvents = useMemo(
    () =>
      events.map(event => ({
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        allDay: event.allDay,
        resourceId: event.resourceId,
        color: TONE_COLOR[event.tone ?? 'brand'],
        readOnly: true,
        data: event,
      })),
    [events]
  );

  return (
    <EventCalendarRoot<EventCalendarEvent>
      id={id}
      aria-label={props['aria-label']}
      data-testid={props['data-testid']}
      className={cn('bg-background overflow-hidden rounded-lg border', SIZE_CLASS[size])}
      events={calendarEvents}
      view={view}
      defaultView={defaultView ?? views[0]}
      onViewChange={onViewChange as (next: string) => void}
      date={date}
      defaultDate={defaultDate}
      onDateChange={onDateChange}
      views={views}
      timeZone={timeZone}
      weekStartsOn={weekStartsOn}
      resources={resources}
      loading={loading}
      interactions={NO_INTERACTIONS}
      onEventClick={
        onEventClick && (occurrence => occurrence.event.data && onEventClick(occurrence.event.data))
      }
      onRangeChange={onRangeChange && (info => onRangeChange(info.range))}
    >
      <EventCalendarNav showViewSwitcher={views.length > 1} />
      <EventCalendarContent />
    </EventCalendarRoot>
  );
};
