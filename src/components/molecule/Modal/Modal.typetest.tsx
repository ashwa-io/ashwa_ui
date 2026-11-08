import { Modal } from './Modal';

const noop = () => {};

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const ModalTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <Modal open onClose={noop} title="a" className="x">
      b
    </Modal>
    {/* @ts-expect-error style is not part of the public API */}
    <Modal open onClose={noop} title="a" style={{ width: 900 }}>
      b
    </Modal>
    {/* @ts-expect-error title is required: it names the dialog */}
    <Modal open onClose={noop}>
      b
    </Modal>
    {/* @ts-expect-error sizes are sm | md | lg | xl | 2xl */}
    <Modal open onClose={noop} title="a" size="3xl">
      b
    </Modal>
    <Modal open onClose={noop} title="a" size="2xl" fixedHeight flush closable={false}>
      b
    </Modal>
  </div>
);
