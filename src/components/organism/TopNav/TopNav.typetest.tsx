import { TopNav } from './TopNav';

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const TopNavTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <TopNav title="a" className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <TopNav title="a" style={{}} />
    <TopNav logo="a" logoHref="/" logoLabel="b" title="c" endContent="d" />
  </div>
);
