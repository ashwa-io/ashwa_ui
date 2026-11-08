import { Drawer } from './Drawer';

const close = () => undefined;

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const DrawerTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <Drawer open onClose={close} title="a" className="x">
      b
    </Drawer>
    {/* @ts-expect-error style is not part of the public API */}
    <Drawer open onClose={close} title="a" style={{}}>
      b
    </Drawer>
    {/* @ts-expect-error title is required */}
    <Drawer open onClose={close}>
      b
    </Drawer>
    <Drawer open onClose={close} title="a" description="b" footer="c" side="left" size="lg" flush>
      d
    </Drawer>
  </div>
);
