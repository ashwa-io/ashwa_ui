import type React from 'react';

export interface CodeProps {
  children: React.ReactNode;
}

export const Code: React.FC<CodeProps> = props => {
  const { children } = props;

  // Sized in em so it follows the surrounding text.
  return (
    <code className="bg-muted rounded-sm px-[0.3em] py-[0.1em] font-mono text-[0.85em]">
      {children}
    </code>
  );
};
