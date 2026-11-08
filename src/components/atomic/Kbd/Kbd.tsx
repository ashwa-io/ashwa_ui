import type React from 'react';

import { Kbd as KbdPrimitive, KbdGroup } from '@/components/ui/kbd';

export interface KbdProps {
  /** e.g. ['Ctrl', 'B'] */
  keys: string[];
}

export const Kbd: React.FC<KbdProps> = props => {
  const { keys } = props;

  return (
    <KbdGroup>
      {keys.map(key => (
        <KbdPrimitive key={key}>{key}</KbdPrimitive>
      ))}
    </KbdGroup>
  );
};
