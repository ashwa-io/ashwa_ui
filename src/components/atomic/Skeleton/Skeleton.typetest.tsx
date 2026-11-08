import { Skeleton } from './Skeleton';

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const SkeletonTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <Skeleton className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <Skeleton style={{ width: 10 }} />
    {/* @ts-expect-error size comes from a wrapper div, not props */}
    <Skeleton width="80%" />
    <Skeleton shape="circle" />
  </div>
);
