import { Tooltip } from './Tooltip';

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const TooltipTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <Tooltip content="a" className="x">
      b
    </Tooltip>
    {/* @ts-expect-error style is not part of the public API */}
    <Tooltip content="a" style={{ color: 'red' }}>
      b
    </Tooltip>
    {/* @ts-expect-error tooltips hold plain text only */}
    <Tooltip content={<b>a</b>}>b</Tooltip>
    <Tooltip content="a" side="right">
      b
    </Tooltip>
  </div>
);
