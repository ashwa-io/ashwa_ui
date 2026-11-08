import type React from 'react';

export type FormLayoutDirection = 'vertical' | 'horizontal';

export interface FormLayoutProps {
  children: React.ReactNode;
  /** horizontal: fields side by side in equal columns from sm up, stacked on phones. */
  direction?: FormLayoutDirection;
  'data-testid'?: string;
}

const DIRECTION: Record<FormLayoutDirection, string> = {
  vertical: 'flex flex-col gap-5',
  horizontal: 'grid gap-5 sm:auto-cols-fr sm:grid-flow-col',
};

export const FormLayout: React.FC<FormLayoutProps> = props => {
  const { children, direction = 'vertical', 'data-testid': testId } = props;

  return (
    <div data-testid={testId} className={DIRECTION[direction]}>
      {children}
    </div>
  );
};
