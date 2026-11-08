import { AspectRatio } from './AspectRatio';

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const AspectRatioTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <AspectRatio className="x">a</AspectRatio>
    {/* @ts-expect-error style is not part of the public API */}
    <AspectRatio style={{}}>a</AspectRatio>
    <AspectRatio ratio={4 / 3}>a</AspectRatio>
  </div>
);
