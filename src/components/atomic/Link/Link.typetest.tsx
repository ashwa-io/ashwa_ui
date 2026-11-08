import { Link } from './Link';

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const LinkTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <Link href="/a" className="x">
      a
    </Link>
    {/* @ts-expect-error style is not part of the public API */}
    <Link href="/a" style={{ color: 'red' }}>
      a
    </Link>
    {/* @ts-expect-error href is required */}
    <Link>a</Link>
    <Link href="/a" aria-label="b" onClick={() => {}}>
      a
    </Link>
  </div>
);
