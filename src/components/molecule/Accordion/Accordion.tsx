import type React from 'react';

import {
  Accordion as AccordionRoot,
  AccordionContent,
  AccordionItem as AccordionItemPrimitive,
  AccordionTrigger,
} from '@/components/ui/accordion';

export interface AccordionItem {
  value: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Lets several items stay open at once. */
  multiple?: boolean;
  defaultValue?: string[];
  'data-testid'?: string;
}

export const Accordion: React.FC<AccordionProps> = props => {
  const { items, multiple = false, defaultValue, 'data-testid': testId } = props;

  return (
    <AccordionRoot multiple={multiple} defaultValue={defaultValue} data-testid={testId}>
      {items.map(item => (
        <AccordionItemPrimitive key={item.value} value={item.value} disabled={item.disabled}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItemPrimitive>
      ))}
    </AccordionRoot>
  );
};
