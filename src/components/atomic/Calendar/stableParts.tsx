/* eslint-disable no-restricted-syntax -- internal adapters: they forward the day picker's own props. */
import { useEffect, useRef } from 'react';

import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import type { CustomComponents } from 'react-day-picker';

import { CalendarDayButton } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

// shortcut: both of these are bugs in shadcn's calendar, which ui/ rules say not to edit. Delete this
// file and the components prop once the registry fixes them:
// 1. Its inline Root and Chevron change identity each render, so a parent render rebuilds the grid.
// 2. Its day button never attaches its ref, so arrow keys can't move focus.

const Root: CustomComponents['Root'] = ({ className, rootRef, ...props }) => (
  <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />
);

const Chevron: CustomComponents['Chevron'] = ({ className, orientation, ...props }) => {
  if (orientation === 'left') {
    return <ChevronLeftIcon className={cn('size-4', className)} {...props} />;
  }
  if (orientation === 'right') {
    return <ChevronRightIcon className={cn('size-4', className)} {...props} />;
  }
  return <ChevronDownIcon className={cn('size-4', className)} {...props} />;
};

const DayButton: CustomComponents['DayButton'] = props => {
  const { focused } = props.modifiers;
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (focused) ref.current?.focus();
  }, [focused]);

  return <CalendarDayButton {...props} {...{ ref }} />;
};

export const STABLE_PARTS: Partial<CustomComponents> = { Root, Chevron, DayButton };
