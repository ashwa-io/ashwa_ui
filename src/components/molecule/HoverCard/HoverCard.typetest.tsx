import { HoverCard } from './HoverCard';

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const HoverCardTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <HoverCard content="a" className="x">
      b
    </HoverCard>
    {/* @ts-expect-error style is not part of the public API */}
    <HoverCard content="a" style={{}}>
      b
    </HoverCard>
    <HoverCard content={<span>a</span>} side="left">
      b
    </HoverCard>
  </div>
);
