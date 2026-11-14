'use client';

import {
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type Ref,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

export const cardVariants = cva(
  [
    'mhui:relative mhui:flex mhui:flex-col mhui:rounded-none',
    'mhui:text-slate-900 mhui:dark:text-slate-100',
  ],
  {
    variants: {
      variant: {
        elevated: 'mhui:bg-white mhui:shadow-md mhui:dark:bg-slate-900 mhui:dark:shadow-black/40',
        filled: 'mhui:bg-slate-100 mhui:dark:bg-slate-800',
        subtle: 'mhui:bg-slate-50 mhui:dark:bg-slate-900/60',
      },
      padding: {
        none: 'mhui:gap-0 mhui:p-0',
        sm: 'mhui:gap-3 mhui:p-4',
        md: 'mhui:gap-5 mhui:p-6',
        lg: 'mhui:gap-6 mhui:p-8',
      },
      interactive: {
        true: [
          'mhui:cursor-pointer mhui:transition-all mhui:duration-200 mhui:ease-out',
          'mhui:focus-visible:ring-2 mhui:focus-visible:ring-blue-900 mhui:focus-visible:ring-offset-2 mhui:focus-visible:outline-none',
          'mhui:dark:focus-visible:ring-blue-400 mhui:dark:focus-visible:ring-offset-slate-950',
        ],
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'elevated',
        interactive: true,
        className:
          'mhui:hover:-translate-y-0.5 mhui:hover:bg-slate-50/80 mhui:hover:shadow-lg mhui:dark:hover:bg-slate-800/90',
      },
      {
        variant: 'filled',
        interactive: true,
        className:
          'mhui:hover:-translate-y-0.5 mhui:hover:bg-slate-200/75 mhui:hover:shadow-sm mhui:dark:hover:bg-slate-700/80',
      },
      {
        variant: 'subtle',
        interactive: true,
        className:
          'mhui:hover:-translate-y-0.5 mhui:hover:bg-slate-100 mhui:hover:shadow-sm mhui:dark:hover:bg-slate-800/70',
      },
    ],
    defaultVariants: {
      variant: 'elevated',
      padding: 'md',
      interactive: false,
    },
  },
);

export type CardVariant = NonNullable<VariantProps<typeof cardVariants>['variant']>;
export type CardPadding = NonNullable<VariantProps<typeof cardVariants>['padding']>;
export type CardElement = 'div' | 'article' | 'section';

export interface CardProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof cardVariants> {
  /** Semantic HTML element to render for the card surface */
  as?: CardElement;
  /** Visual surface style using elevation or subtle background contrast */
  variant?: CardVariant;
  /** Internal spacing scale of the card container */
  padding?: CardPadding;
  /** Applies hover elevation and interactive cursor when the card is clickable */
  interactive?: boolean;
}

export const Card = forwardRef<HTMLElement, CardProps>(
  (
    {
      as: Component = 'div',
      variant = 'elevated',
      padding = 'md',
      interactive = false,
      className,
      tabIndex,
      onClick,
      onKeyDown,
      children,
      ...props
    },
    ref,
  ) => {
    const resolvedTabIndex = interactive && tabIndex === undefined ? 0 : tabIndex;

    const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) {
        return;
      }
      if (interactive && onClick && event.target === event.currentTarget) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick(event as unknown as MouseEvent<HTMLElement>);
        }
      }
    };

    return (
      <Component
        ref={ref as Ref<HTMLDivElement>}
        tabIndex={resolvedTabIndex}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        data-interactive={interactive || undefined}
        className={cn(cardVariants({ variant, padding, interactive }), className)}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Card.displayName = 'Card';

export type CardHeaderProps = HTMLAttributes<HTMLDivElement>;

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('mhui:flex mhui:flex-col mhui:gap-1.5', className)} {...props}>
        {children}
      </div>
    );
  },
);

CardHeader.displayName = 'CardHeader';

export type CardBodyProps = HTMLAttributes<HTMLDivElement>;

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'mhui:flex-1 mhui:text-sm mhui:leading-relaxed mhui:text-slate-700 mhui:dark:text-slate-300',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

CardBody.displayName = 'CardBody';

export const cardFooterVariants = cva('mhui:flex mhui:items-center mhui:gap-3 mhui:pt-2', {
  variants: {
    align: {
      start: 'mhui:justify-start',
      center: 'mhui:justify-center',
      end: 'mhui:justify-end',
      between: 'mhui:justify-between',
    },
  },
  defaultVariants: {
    align: 'end',
  },
});

export type CardFooterAlign = NonNullable<VariantProps<typeof cardFooterVariants>['align']>;

export interface CardFooterProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardFooterVariants> {
  /** Horizontal alignment of footer actions */
  align?: CardFooterAlign;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ align = 'end', className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(cardFooterVariants({ align }), className)} {...props}>
        {children}
      </div>
    );
  },
);

CardFooter.displayName = 'CardFooter';
