import { ConfirmDialog } from './ConfirmDialog';

const noop = () => {};

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const ConfirmDialogTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <ConfirmDialog open onClose={noop} onConfirm={noop} title="a" confirmLabel="b" className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <ConfirmDialog open onClose={noop} onConfirm={noop} title="a" confirmLabel="b" style={{}} />
    {/* @ts-expect-error confirmLabel is required: it says what the action does */}
    <ConfirmDialog open onClose={noop} onConfirm={noop} title="a" />
    <ConfirmDialog open onClose={noop} onConfirm={noop} title="a" confirmLabel="b" destructive />
  </div>
);
