import { UploadPill } from './UploadPill';

const noop = (id: string) => id;
const items = [{ id: 'a', name: 'bill.jpg', state: 'uploading' as const, progress: 40 }];

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const UploadPillTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <UploadPill items={items} onCancel={noop} onRetry={noop} onRemove={noop} className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <UploadPill items={items} onCancel={noop} onRetry={noop} onRemove={noop} style={{}} />
    {/* @ts-expect-error render is not part of the public API */}
    <UploadPill items={items} onCancel={noop} onRetry={noop} onRemove={noop} render={<div />} />
    {/* @ts-expect-error asChild is not part of the public API */}
    <UploadPill items={items} onCancel={noop} onRetry={noop} onRemove={noop} asChild />
    {/* @ts-expect-error a running upload must be stoppable */}
    <UploadPill items={items} onRetry={noop} onRemove={noop} />
    <UploadPill
      // @ts-expect-error the state is one of four, not free text
      items={[{ id: 'a', name: 'bill.jpg', state: 'paused' }]}
      onCancel={noop}
      onRetry={noop}
      onRemove={noop}
    />
    <UploadPill items={items} onCancel={noop} onRetry={noop} onRemove={noop} />
  </div>
);
