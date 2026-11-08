import { toast } from './toast';
import { Toaster } from './Toaster';

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const ToasterTypeTest: React.FC = () => {
  // @ts-expect-error toasts hold plain text only
  toast.success(<b>a</b>);
  // @ts-expect-error sonner's styling options are not exposed
  toast.success('a', { className: 'x' });
  // @ts-expect-error sonner's action buttons are not exposed
  toast.error('a', { action: { label: 'b', onClick: () => {} } });
  toast.info('a', { description: 'b', duration: 2000 });

  return (
    <div>
      {/* @ts-expect-error the position is fixed by the design system */}
      <Toaster position="top-left" />
      <Toaster />
    </div>
  );
};
