import { EmptyState } from './EmptyState';

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const EmptyStateTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <EmptyState className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <EmptyState style={{}} />
    <EmptyState title="a" description="b" size="sm" action="c" media="d" />
  </div>
);
