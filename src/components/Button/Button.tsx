'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export const buttonVariants = cva(
  [
    'mhui:relative mhui:isolate mhui:overflow-hidden',
    'mhui:inline-flex mhui:items-center mhui:justify-center mhui:font-medium mhui:select-none',
    'mhui:rounded-none',
    'mhui:transition-colors mhui:duration-300 mhui:ease-in-out',
    'mhui:before:pointer-events-none mhui:before:absolute mhui:before:inset-0 mhui:before:-z-10',
    'mhui:before:origin-left mhui:before:scale-x-0 mhui:before:transition-transform mhui:before:duration-300 mhui:before:ease-in-out',
    'mhui:hover:before:scale-x-100',
    'mhui:focus-visible:outline-none mhui:focus-visible:ring-2 mhui:focus-visible:ring-offset-2',
    'mhui:disabled:pointer-events-none mhui:disabled:opacity-50',
    'mhui:cursor-pointer',
  ],
  {
    variants: {
      variant: {
        primary:
          'mhui:bg-blue-900 mhui:text-white mhui:before:bg-blue-700 mhui:active:before:bg-blue-950 mhui:focus-visible:ring-blue-900',
        secondary:
          'mhui:bg-slate-600 mhui:text-white mhui:before:bg-slate-500 mhui:active:before:bg-slate-700 mhui:focus-visible:ring-slate-600',
        outline:
          'mhui:border mhui:border-blue-900 mhui:bg-transparent mhui:text-blue-900 mhui:hover:text-white mhui:before:bg-blue-900 mhui:active:before:bg-blue-950 mhui:focus-visible:ring-blue-900',
        text: 'mhui:bg-transparent mhui:text-blue-900 mhui:hover:text-blue-950 mhui:before:bg-blue-100 mhui:active:before:bg-blue-200 mhui:focus-visible:ring-blue-900',
        success:
          'mhui:bg-emerald-800 mhui:text-white mhui:before:bg-emerald-600 mhui:active:before:bg-emerald-900 mhui:focus-visible:ring-emerald-800',
        warning:
          'mhui:bg-amber-600 mhui:text-white mhui:before:bg-amber-500 mhui:active:before:bg-amber-700 mhui:focus-visible:ring-amber-600',
        danger:
          'mhui:bg-red-700 mhui:text-white mhui:before:bg-red-600 mhui:active:before:bg-red-800 mhui:focus-visible:ring-red-700',
      },
      size: {
        xs: 'mhui:h-7 mhui:px-2.5 mhui:text-xs mhui:gap-1.5',
        sm: 'mhui:h-8 mhui:px-3 mhui:text-sm mhui:gap-1.5',
        md: 'mhui:h-10 mhui:px-4 mhui:text-sm mhui:gap-2',
        lg: 'mhui:h-12 mhui:px-6 mhui:text-base mhui:gap-2.5',
        xl: 'mhui:h-14 mhui:px-8 mhui:text-lg mhui:gap-3',
      },
      iconOnly: {
        true: 'mhui:p-0',
        false: '',
      },
    },
    compoundVariants: [
      { size: 'xs', iconOnly: true, className: 'mhui:h-7 mhui:w-7 mhui:px-0' },
      { size: 'sm', iconOnly: true, className: 'mhui:h-8 mhui:w-8 mhui:px-0' },
      { size: 'md', iconOnly: true, className: 'mhui:h-10 mhui:w-10 mhui:px-0' },
      { size: 'lg', iconOnly: true, className: 'mhui:h-12 mhui:w-12 mhui:px-0' },
      { size: 'xl', iconOnly: true, className: 'mhui:h-14 mhui:w-14 mhui:px-0' },
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
          <Icon size={iconPixels} className="mhui:shrink-0" aria-hidden="true" />
        )}
        {!isIconOnly && children}
        {Icon && !isIconOnly && iconPosition === 'right' && (
          <Icon size={iconPixels} className="mhui:shrink-0" aria-hidden="true" />
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
