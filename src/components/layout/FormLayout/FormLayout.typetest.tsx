import { FormLayout } from './FormLayout';

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const FormLayoutTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <FormLayout className="x">a</FormLayout>
    {/* @ts-expect-error style is not part of the public API */}
    <FormLayout style={{ gap: 4 }}>a</FormLayout>
    {/* @ts-expect-error direction is vertical or horizontal */}
    <FormLayout direction="grid">a</FormLayout>
    <FormLayout direction="horizontal">a</FormLayout>
  </div>
);
