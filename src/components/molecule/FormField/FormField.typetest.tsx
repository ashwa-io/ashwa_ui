import { FormField } from './FormField';

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const FormFieldTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <FormField label="a" className="x">
      {control => <input id={control.id} />}
    </FormField>
    {/* @ts-expect-error style is not part of the public API */}
    <FormField label="a" style={{ color: 'red' }}>
      {control => <input id={control.id} />}
    </FormField>
    <FormField label="a">
      {/* @ts-expect-error children is a render function that receives the control props */}
      <input />
    </FormField>
    <FormField label="a" error="b" required orientation="horizontal">
      {control => <input id={control.id} aria-invalid={control['aria-invalid']} />}
    </FormField>
  </div>
);
