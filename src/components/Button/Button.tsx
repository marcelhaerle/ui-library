'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export const buttonVariants = cva(
  [
    'relative isolate overflow-hidden',
    'inline-flex items-center justify-center font-medium select-none',
    'rounded-none',
    'transition-colors duration-300 ease-in-out',
    'before:pointer-events-none before:absolute before:inset-0 before:-z-10',
    'before:origin-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-in-out',
    'hover:before:scale-x-100',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'cursor-pointer',
  ],
  {
    variants: {
      variant: {
        primary:
          'bg-blue-900 text-white before:bg-blue-700 active:before:bg-blue-950 focus-visible:ring-blue-900',
        secondary:
          'bg-slate-600 text-white before:bg-slate-500 active:before:bg-slate-700 focus-visible:ring-slate-600',
        outline:
          'border border-blue-900 bg-transparent text-blue-900 hover:text-white before:bg-blue-900 active:before:bg-blue-950 focus-visible:ring-blue-900',
        text: 'bg-transparent text-blue-900 hover:text-blue-950 before:bg-blue-100 active:before:bg-blue-200 focus-visible:ring-blue-900',
        success:
          'bg-emerald-800 text-white before:bg-emerald-600 active:before:bg-emerald-900 focus-visible:ring-emerald-800',
        warning:
          'bg-amber-600 text-white before:bg-amber-500 active:before:bg-amber-700 focus-visible:ring-amber-600',
        danger:
          'bg-red-700 text-white before:bg-red-600 active:before:bg-red-800 focus-visible:ring-red-700',
      },
      size: {
        xs: 'h-7 px-2.5 text-xs gap-1.5',
        sm: 'h-8 px-3 text-sm gap-1.5',
        md: 'h-10 px-4 text-sm gap-2',
        lg: 'h-12 px-6 text-base gap-2.5',
        xl: 'h-14 px-8 text-lg gap-3',
      },
      iconOnly: {
        true: 'p-0',
        false: '',
      },
    },
    compoundVariants: [
      { size: 'xs', iconOnly: true, className: 'h-7 w-7 px-0' },
      { size: 'sm', iconOnly: true, className: 'h-8 w-8 px-0' },
      { size: 'md', iconOnly: true, className: 'h-10 w-10 px-0' },
      { size: 'lg', iconOnly: true, className: 'h-12 w-12 px-0' },
      { size: 'xl', iconOnly: true, className: 'h-14 w-14 px-0' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      iconOnly: false,
    },
  },
);

export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>;
export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>;

const iconSizeMap: Record<ButtonSize, number> = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 24,
};

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /** Optional Lucide icon component */
  icon?: LucideIcon;
  /** Position of the icon when children are present */
  iconPosition?: 'left' | 'right';
  /** Render the button as a square icon-only button */
  iconOnly?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      icon: Icon,
      iconPosition = 'left',
      iconOnly = false,
      type = 'button',
      children,
      ...props
    },
    ref,
  ) => {
    const resolvedSize: ButtonSize = size ?? 'md';
    const isIconOnly = Boolean(iconOnly || (Icon && !children));
    const iconPixels = iconSizeMap[resolvedSize];

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          buttonVariants({
            variant,
            size: resolvedSize,
            iconOnly: isIconOnly,
          }),
          className,
        )}
        {...props}
      >
        {Icon && (isIconOnly || iconPosition === 'left') && (
          <Icon size={iconPixels} className="shrink-0" aria-hidden="true" />
        )}
        {!isIconOnly && children}
        {Icon && !isIconOnly && iconPosition === 'right' && (
          <Icon size={iconPixels} className="shrink-0" aria-hidden="true" />
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
