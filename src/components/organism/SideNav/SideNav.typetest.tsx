import { SideNav } from './SideNav';

const groups = [{ label: 'a', items: [{ label: 'b', href: '/b' }] }];

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const SideNavTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <SideNav groups={groups} currentPath="/b" className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <SideNav groups={groups} currentPath="/b" style={{}} />
    {/* @ts-expect-error items need an href */}
    <SideNav groups={[{ items: [{ label: 'b' }] }]} currentPath="/b" />
    <SideNav groups={groups} currentPath="/b" collapsible footer="c" header="d" />
  </div>
);
