import { Avatar } from './Avatar';

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const AvatarTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <Avatar name="a" className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <Avatar name="a" style={{ width: 10 }} />
    {/* @ts-expect-error sizes are sm | md | lg, not pixels */}
    <Avatar name="a" size={48} />
    {/* @ts-expect-error name is required: it gives the initials and the alt text */}
    <Avatar />
    <Avatar name="a" src={null} size="lg" shape="circle" />
  </div>
);
