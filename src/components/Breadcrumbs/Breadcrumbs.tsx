'use client';

import {
  Children,
  forwardRef,
  isValidElement,
  useState,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronRight, MoreHorizontal, type LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export const breadcrumbsVariants = cva('mhui:w-full mhui:text-sm', {
  variants: {
    size: {
      sm: 'mhui:text-xs',
      md: 'mhui:text-sm',
      lg: 'mhui:text-base',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const breadcrumbItemVariants = cva(
  [
    'mhui:inline-flex mhui:items-center mhui:gap-1.5 mhui:rounded-none',
    'mhui:transition-colors mhui:duration-150',
    'mhui:focus-visible:outline-none mhui:focus-visible:ring-2 mhui:focus-visible:ring-blue-900 mhui:focus-visible:ring-offset-2',
    'mhui:dark:focus-visible:ring-blue-400 mhui:dark:focus-visible:ring-offset-slate-950',
  ],
  {
    variants: {
      current: {
        true: 'mhui:font-semibold mhui:text-blue-900 mhui:dark:text-blue-300',
        false: 'mhui:font-medium mhui:text-slate-600 mhui:dark:text-slate-400',
      },
      interactive: {
        true: 'mhui:hover:text-blue-900 mhui:hover:underline mhui:underline-offset-4 mhui:dark:hover:text-white mhui:cursor-pointer',
        false: '',
      },
    },
    defaultVariants: {
      current: false,
      interactive: false,
    },
  },
);

export interface BreadcrumbsProps
  extends HTMLAttributes<HTMLElement>, VariantProps<typeof breadcrumbsVariants> {
  /** Custom separator node or LucideIcon between breadcrumb items (default: `ChevronRight`) */
  separator?: ReactNode | LucideIcon;
  /** Maximum number of items to display before collapsing middle items with an ellipsis */
  maxItems?: number;
}

export interface BreadcrumbItemProps
  extends
    AnchorHTMLAttributes<HTMLAnchorElement>,
    Omit<VariantProps<typeof breadcrumbItemVariants>, 'interactive'> {
  /** Destination URL for the breadcrumb link */
  href?: string;
  /** Whether this item represents the current page (`aria-current="page"`) */
  current?: boolean;
}

const isComponentSeparator = (separator: ReactNode | LucideIcon): separator is LucideIcon => {
  if (typeof separator === 'function') {
    return true;
  }
  return (
    typeof separator === 'object' &&
    separator !== null &&
    !isValidElement(separator) &&
    '$$typeof' in separator
  );
};

const renderSeparator = (separator: ReactNode | LucideIcon): ReactNode => {
  if (isComponentSeparator(separator)) {
    const SeparatorIcon = separator;
    return <SeparatorIcon className="mhui:h-3.5 mhui:w-3.5 mhui:shrink-0" aria-hidden={true} />;
  }
  return separator;
};

export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(
  (
    {
      className,
      size = 'md',
      separator = ChevronRight,
      maxItems,
      'aria-label': ariaLabel = 'Breadcrumb',
      children,
      ...props
    },
    ref,
  ) => {
    const [expanded, setExpanded] = useState(false);
    const allItems = Children.toArray(children).filter(Boolean);

    const shouldCollapse =
      !expanded && typeof maxItems === 'number' && maxItems > 0 && allItems.length > maxItems;

    let visibleItems: Array<{ key: string; node: ReactNode }> = allItems.map((node, index) => ({
      key: `item-${index}`,
      node,
    }));

    if (shouldCollapse && maxItems) {
      if (maxItems === 1) {
        const lastItem = allItems[allItems.length - 1];
        visibleItems = [
          {
            key: 'ellipsis',
            node: (
              <button
                type="button"
                aria-label="Show full breadcrumb path"
                onClick={() => setExpanded(true)}
                className={cn(
                  'mhui:inline-flex mhui:items-center mhui:justify-center mhui:px-1.5 mhui:py-0.5',
                  'mhui:rounded-none mhui:bg-slate-100 mhui:text-slate-600 mhui:hover:bg-slate-200 mhui:hover:text-blue-900',
                  'mhui:dark:bg-slate-800 mhui:dark:text-slate-300 mhui:dark:hover:bg-slate-700 mhui:dark:hover:text-white',
                  'mhui:cursor-pointer mhui:transition-colors mhui:duration-150',
                  'mhui:focus-visible:ring-2 mhui:focus-visible:ring-blue-900 mhui:focus-visible:ring-offset-2 mhui:focus-visible:outline-none',
                  'mhui:dark:focus-visible:ring-blue-400 mhui:dark:focus-visible:ring-offset-slate-950',
                )}
              >
                <MoreHorizontal className="mhui:h-4 mhui:w-4" aria-hidden="true" />
                <span className="mhui:sr-only">...</span>
              </button>
            ),
          },
          {
            key: `item-${allItems.length - 1}`,
            node: lastItem,
          },
        ];
      } else {
        const itemsBefore = 1;
        const itemsAfter = maxItems - 1;
        const head = allItems.slice(0, itemsBefore).map((node, index) => ({
          key: `item-${index}`,
          node,
        }));
        const tail = allItems.slice(allItems.length - itemsAfter).map((node, index) => ({
          key: `item-${allItems.length - itemsAfter + index}`,
          node,
        }));

        visibleItems = [
          ...head,
          {
            key: 'ellipsis',
            node: (
              <button
                type="button"
                aria-label="Show full breadcrumb path"
                onClick={() => setExpanded(true)}
                className={cn(
                  'mhui:inline-flex mhui:items-center mhui:justify-center mhui:px-1.5 mhui:py-0.5',
                  'mhui:rounded-none mhui:bg-slate-100 mhui:text-slate-600 mhui:hover:bg-slate-200 mhui:hover:text-blue-900',
                  'mhui:dark:bg-slate-800 mhui:dark:text-slate-300 mhui:dark:hover:bg-slate-700 mhui:dark:hover:text-white',
                  'mhui:cursor-pointer mhui:transition-colors mhui:duration-150',
                  'mhui:focus-visible:ring-2 mhui:focus-visible:ring-blue-900 mhui:focus-visible:ring-offset-2 mhui:focus-visible:outline-none',
                  'mhui:dark:focus-visible:ring-blue-400 mhui:dark:focus-visible:ring-offset-slate-950',
                )}
              >
                <MoreHorizontal className="mhui:h-4 mhui:w-4" aria-hidden="true" />
                <span className="mhui:sr-only">...</span>
              </button>
            ),
          },
          ...tail,
        ];
      }
    }

    return (
      <nav
        ref={ref}
        aria-label={ariaLabel}
        className={cn(breadcrumbsVariants({ size }), className)}
        {...props}
      >
        <ol className="mhui:flex mhui:flex-wrap mhui:items-center mhui:gap-2">
          {visibleItems.map((item, index) => (
            <li key={item.key} className="mhui:inline-flex mhui:items-center mhui:gap-2">
              {index > 0 && (
                <span
                  role="presentation"
                  aria-hidden="true"
                  className="mhui:inline-flex mhui:items-center mhui:text-slate-400 mhui:select-none mhui:dark:text-slate-500"
                >
                  {renderSeparator(separator)}
                </span>
              )}
              {item.node}
            </li>
          ))}
        </ol>
      </nav>
    );
  },
);

Breadcrumbs.displayName = 'Breadcrumbs';

export const BreadcrumbItem = forwardRef<HTMLElement, BreadcrumbItemProps>(
  ({ className, href, current = false, children, ...props }, ref) => {
    const isInteractive = Boolean(href) && !current;
    const itemClasses = cn(
      breadcrumbItemVariants({ current: Boolean(current), interactive: isInteractive }),
      className,
    );

    if (href && !current) {
      return (
        <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={itemClasses} {...props}>
          {children}
        </a>
      );
    }

    if (href && current) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          aria-current="page"
          className={itemClasses}
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <span
        ref={ref as React.Ref<HTMLSpanElement>}
        aria-current={current ? 'page' : undefined}
        className={itemClasses}
        {...(props as HTMLAttributes<HTMLSpanElement>)}
      >
        {children}
      </span>
    );
  },
);

BreadcrumbItem.displayName = 'BreadcrumbItem';
