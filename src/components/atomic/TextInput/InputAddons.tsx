import type React from 'react';

import { InputGroup, InputGroupAddon, InputGroupText } from '@/components/ui/input-group';
import type { IconComponent } from '@/lib/types';

/** Prefix and suffix props shared by TextInput and NumberInput. */
export interface InputAddonProps {
  /** e.g. '+91' */
  startText?: string;
  /** e.g. 'km' */
  endText?: string;
}

interface InputAddonsProps extends InputAddonProps {
  icon?: IconComponent;
  /** e.g. an IconButton to clear or copy. */
  endAction?: React.ReactNode;
  /** An InputGroupInput. */
  children: React.ReactNode;
}

export const InputAddons: React.FC<InputAddonsProps> = props => {
  const { icon: Icon, startText, endText, endAction, children } = props;

  return (
    // The primitive dims on any disabled descendant, so a disabled end button would dim the field.
    <InputGroup className="dark:has-disabled:bg-input/30 has-[input:disabled]:bg-input/50 dark:has-[input:disabled]:bg-input/80 has-disabled:bg-transparent has-disabled:opacity-100 has-[input:disabled]:opacity-50">
      {children}
      {(Icon || startText) && (
        <InputGroupAddon>
          {Icon && <Icon aria-hidden />}
          {startText && <InputGroupText>{startText}</InputGroupText>}
        </InputGroupAddon>
      )}
      {(endText || endAction) && (
        <InputGroupAddon align="inline-end">
          {endText && <InputGroupText>{endText}</InputGroupText>}
          {endAction}
        </InputGroupAddon>
      )}
    </InputGroup>
  );
};
