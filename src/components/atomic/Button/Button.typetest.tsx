import { Button } from './Button';

// Compile-time contract, checked by `yarn typecheck`, never rendered or published:
// the public API refuses every styling escape hatch.
export const ButtonTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <Button className="x">a</Button>
    {/* @ts-expect-error style is not part of the public API */}
    <Button style={{ color: 'red' }}>a</Button>
    {/* @ts-expect-error asChild is not part of the public API */}
    <Button asChild>a</Button>
    {/* @ts-expect-error render is not part of the public API */}
    <Button render={<a href="/x">x</a>}>a</Button>
    {/* @ts-expect-error href is a URL string */}
    <Button href={5}>a</Button>
    <Button variant="ghost" size="sm">
      a
    </Button>
  </div>
);
