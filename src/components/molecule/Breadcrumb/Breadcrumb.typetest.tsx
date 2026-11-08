import { Breadcrumb } from './Breadcrumb';

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const BreadcrumbTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <Breadcrumb items={[]} className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <Breadcrumb items={[]} style={{}} />
    <Breadcrumb items={[{ label: 'a', href: '/' }, { label: 'b' }]} aria-label="Path" />
  </div>
);
