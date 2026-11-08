import { AppShell } from './AppShell';

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const AppShellTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <AppShell className="x">a</AppShell>
    {/* @ts-expect-error style is not part of the public API */}
    <AppShell style={{}}>a</AppShell>
    {/* @ts-expect-error height is screen or fill */}
    <AppShell height="auto">a</AppShell>
    <AppShell topNav="a" sideNav="b" height="fill">
      c
    </AppShell>
  </div>
);
