import { EventCalendar } from './EventCalendar';

const start = new Date('2026-11-10T04:30:00Z');
const end = new Date('2026-11-10T05:30:00Z');
const events = [{ id: 'a', title: 'Insurance due', start, end }];

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const EventCalendarTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <EventCalendar events={events} className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <EventCalendar events={events} style={{}} />
    {/* @ts-expect-error render is not part of the public API */}
    <EventCalendar events={events} render={<div />} />
    {/* @ts-expect-error asChild is not part of the public API */}
    <EventCalendar events={events} asChild />
    {/* @ts-expect-error event times are instants, not strings */}
    <EventCalendar events={[{ id: 'a', title: 'x', start: '2026-11-10', end }]} />
    {/* @ts-expect-error colour comes from a tone, never a raw value */}
    <EventCalendar events={[{ id: 'a', title: 'x', start, end, color: 'red' }]} />
    <EventCalendar
      events={[{ id: 'a', title: 'x', start, end, tone: 'warning', resourceId: 'v1' }]}
      views={['month', 'resource']}
      resources={[{ id: 'v1', title: 'CG04 AB 1234' }]}
      timeZone="Asia/Kolkata"
      weekStartsOn={1}
      size="fill"
      toolbar={false}
      bordered={false}
    />
  </div>
);
