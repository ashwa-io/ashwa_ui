import { RadioGroup } from './RadioGroup';

const change = (value: string) => value;
const options = [{ value: 'a', label: 'b' }];

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const RadioGroupTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <RadioGroup label="a" value="a" onChange={change} options={options} className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <RadioGroup label="a" value="a" onChange={change} options={options} style={{}} />
    <RadioGroup
      label="a"
      value={null}
      onChange={change}
      options={options}
      orientation="horizontal"
    />
  </div>
);
