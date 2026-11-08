import { BoldIcon } from 'lucide-react';

import { Toggle } from './Toggle';

const change = (pressed: boolean) => pressed;

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const ToggleTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <Toggle pressed onChange={change} className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <Toggle pressed onChange={change} style={{}} />
    <Toggle pressed onChange={change} icon={BoldIcon} aria-label="a" variant="outline" size="lg" />
  </div>
);
