import { Trash2Icon } from 'lucide-react';

import { IconButton } from './IconButton';

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const IconButtonTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error aria-label is required: it is the only accessible name */}
    <IconButton icon={Trash2Icon} />
    {/* @ts-expect-error className is not part of the public API */}
    <IconButton icon={Trash2Icon} aria-label="Delete" className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <IconButton icon={Trash2Icon} aria-label="Delete" style={{ color: 'red' }} />
    {/* @ts-expect-error an icon-only button has no link look */}
    <IconButton icon={Trash2Icon} aria-label="Delete" variant="link" />
    <IconButton icon={Trash2Icon} aria-label="Delete" variant="destructive" size="sm" />
  </div>
);
