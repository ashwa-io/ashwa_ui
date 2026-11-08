import { Kbd } from './Kbd';

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const KbdTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <Kbd keys={['a']} className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <Kbd keys={['a']} style={{}} />
    {/* @ts-expect-error keys is a list */}
    <Kbd keys="a" />
    <Kbd keys={['Ctrl', 'B']} />
  </div>
);
