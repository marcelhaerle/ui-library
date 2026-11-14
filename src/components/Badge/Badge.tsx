'use client';

import { forwardRef, type HTMLAttributes, type MouseEvent } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X, type LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export const badgeVariants = cva(
  [
    'mhui:inline-flex mhui:items-center mhui:justify-center mhui:font-medium mhui:select-none',
    'mhui:rounded-none mhui:whitespace-nowrap',
    'mhui:transition-colors mhui:duration-200 mhui:ease-in-out',
  ],
  {
    variants: {
      variant: {
        primary: 'mhui:bg-blue-900 mhui:text-white mhui:dark:bg-blue-800 mhui:dark:text-white',
        secondary:
          'mhui:bg-slate-200 mhui:text-slate-800 mhui:dark:bg-slate-800 mhui:dark:text-slate-100',
        outline:
          'mhui:border mhui:border-blue-900 mhui:bg-transparent mhui:text-blue-900 mhui:dark:border-blue-400 mhui:dark:text-blue-300',
        success:
          'mhui:bg-emerald-800 mhui:text-white mhui:dark:bg-emerald-700 mhui:dark:text-white',
        warning: 'mhui:bg-amber-600 mhui:text-white mhui:dark:bg-amber-600 mhui:dark:text-white',
        danger: 'mhui:bg-red-700 mhui:text-white mhui:dark:bg-red-700 mhui:dark:text-white',
      },
      size: {
        sm: 'mhui:h-5 mhui:px-2 mhui:text-xs mhui:gap-1',
        md: 'mhui:h-6 mhui:px-2.5 mhui:text-xs mhui:gap-1.5',
        lg: 'mhui:h-7 mhui:px-3 mhui:text-sm mhui:gap-1.5',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;
export type BadgeSize = NonNullable<VariantProps<typeof badgeVariants>['size']>;

const iconSizeMap: Record<BadgeSize, number> = {
  sm: 12,
  md: 14,
  lg: 16,
};

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  /** Optional leading Lucide icon component */
  icon?: LucideIcon;
  /** Whether the badge displays a remove button */
  removable?: boolean;
  /** Callback fired when the remove button is clicked */
  onRemove?: () => void;
  /** Accessible label for the remove button */
  removeLabel?: string;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      icon: Icon,
      removable = false,
      onRemove,
      removeLabel = 'Remove',
      children,
      ...props
    },
    ref,
  ) => {
    const resolvedSize: BadgeSize = size ?? 'md';
    const iconPixels = iconSizeMap[resolvedSize];

    const handleRemoveClick = (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onRemove?.();
    };

    return (
      <span
        ref={ref}
        className={cn(
          badgeVariants({
            variant,
            size: resolvedSize,
          }),
          className,
        )}
        {...props}
      >
        {Icon && <Icon size={iconPixels} className="mhui:shrink-0" aria-hidden="true" />}
        {children}
        {removable && (
          <button
            type="button"
            onClick={handleRemoveClick}
            aria-label={removeLabel}
            className="mhui:-mr-0.5 mhui:inline-flex mhui:shrink-0 mhui:cursor-pointer mhui:items-center mhui:justify-center mhui:rounded-none mhui:p-0.5 mhui:opacity-80 mhui:transition-opacity mhui:duration-150 mhui:hover:opacity-100 mhui:focus-visible:ring-1 mhui:focus-visible:ring-current mhui:focus-visible:outline-none"
          >
            <X size={iconPixels} aria-hidden="true" />
          </button>
        )}
      </span>
    );
  },
);

Badge.displayName = 'Badge';
