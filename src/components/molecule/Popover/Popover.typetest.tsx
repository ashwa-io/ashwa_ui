import { Popover } from './Popover';

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const PopoverTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <Popover label="a" className="x">
      b
    </Popover>
    {/* @ts-expect-error style is not part of the public API */}
    <Popover label="a" style={{ color: 'red' }}>
      b
    </Popover>
    {/* @ts-expect-error the trigger is drawn by Popover, not passed in */}
    <Popover label="a" trigger={<button type="button" />}>
      b
    </Popover>
    {/* @ts-expect-error widths are sm | md | lg */}
    <Popover label="a" width={300}>
      b
    </Popover>
    <Popover label="a" variant="ghost" side="top" align="end" width="lg">
      b
    </Popover>
    <Popover label="a" triggerContent={<span />} flush>
      b
    </Popover>
  </div>
);
