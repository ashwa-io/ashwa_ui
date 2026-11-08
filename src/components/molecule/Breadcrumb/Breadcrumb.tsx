import { Fragment } from 'react';
import type React from 'react';

import {
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbItem as BreadcrumbItemPrimitive,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useLink } from '@/providers/useLink';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  /** The last item is the current page. */
  items: BreadcrumbItem[];
  'aria-label'?: string;
  'data-testid'?: string;
}

const Crumb: React.FC<{ item: BreadcrumbItem; current: boolean }> = props => {
  const { item, current } = props;
  const link = useLink(current ? undefined : item.href);

  if (current) return <BreadcrumbPage>{item.label}</BreadcrumbPage>;
  if (link.href === undefined) return <span>{item.label}</span>;
  return (
    <BreadcrumbLink href={link.href} target={link.target} rel={link.rel} onClick={link.onClick}>
      {item.label}
    </BreadcrumbLink>
  );
};

export const Breadcrumb: React.FC<BreadcrumbProps> = props => {
  const { items, 'aria-label': ariaLabel = 'Breadcrumb', 'data-testid': testId } = props;

  return (
    <BreadcrumbRoot aria-label={ariaLabel} data-testid={testId}>
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={index}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItemPrimitive>
              <Crumb item={item} current={index === items.length - 1} />
            </BreadcrumbItemPrimitive>
          </Fragment>
        ))}
      </BreadcrumbList>
    </BreadcrumbRoot>
  );
};
