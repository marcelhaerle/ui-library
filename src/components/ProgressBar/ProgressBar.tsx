'use client';

import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

export const progressBarTrackVariants = cva(
  [
    'mhui:relative mhui:w-full mhui:overflow-hidden mhui:rounded-none',
    'mhui:bg-slate-200 mhui:dark:bg-slate-800',
  ],
  {
    variants: {
      size: {
        sm: 'mhui:h-1.5',
        md: 'mhui:h-2.5',
        lg: 'mhui:h-4',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const progressBarFillVariants = cva(
  'mhui:h-full mhui:rounded-none mhui:transition-all mhui:duration-300 mhui:ease-out',
  {
    variants: {
      variant: {
        primary: 'mhui:bg-blue-900 mhui:dark:bg-blue-600',
        success: 'mhui:bg-emerald-800 mhui:dark:bg-emerald-600',
        warning: 'mhui:bg-amber-600 mhui:dark:bg-amber-500',
        danger: 'mhui:bg-red-700 mhui:dark:bg-red-600',
      },
      indeterminate: {
        true: 'mhui:w-1/4 mhui:animate-[mhui-progress-indeterminate_1.6s_ease-in-out_infinite]',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      indeterminate: false,
    },
  },
);

export type ProgressBarVariant = NonNullable<
  VariantProps<typeof progressBarFillVariants>['variant']
>;
export type ProgressBarSize = NonNullable<VariantProps<typeof progressBarTrackVariants>['size']>;

export interface ProgressBarProps
  extends
    HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressBarTrackVariants>,
    Omit<VariantProps<typeof progressBarFillVariants>, 'indeterminate'> {
  /** Current completion value (`0` to `max`) */
  value?: number;
  /** Maximum completion value (default: `100`) */
  max?: number;
  /** Visual color intent (default: `'primary'`) */
  variant?: ProgressBarVariant;
  /** Track height size (default: `'md'`) */
  size?: ProgressBarSize;
  /** Optional visible label rendered above the progress bar */
  label?: ReactNode;
  /** Whether to display the formatted percentage label (default: `false`) */
  showValueLabel?: boolean;
  /** Renders an indeterminate activity bar without a known completion percentage */
  indeterminate?: boolean;
}

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      variant = 'primary',
      size = 'md',
      label,
      showValueLabel = false,
      indeterminate = false,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const labelId = `${generatedId}-label`;

    const safeMax = max > 0 ? max : 100;
    const clampedValue = Math.min(Math.max(0, value), safeMax);
    const percentage = Math.round((clampedValue / safeMax) * 100);

    const resolvedAriaLabelledBy = ariaLabelledBy ?? (label ? labelId : undefined);
    const resolvedAriaLabel = resolvedAriaLabelledBy ? ariaLabel : (ariaLabel ?? 'Progress');

    return (
      <div className={cn('mhui:flex mhui:w-full mhui:flex-col mhui:gap-1.5', className)}>
        {(label || (showValueLabel && !indeterminate)) && (
          <div className="mhui:flex mhui:items-center mhui:justify-between mhui:gap-2 mhui:text-xs mhui:font-medium">
            {label ? (
              <span id={labelId} className="mhui:text-slate-700 mhui:dark:text-slate-200">
                {label}
              </span>
            ) : (
              <span />
            )}
            {showValueLabel && !indeterminate && (
              <span className="mhui:text-slate-600 mhui:tabular-nums mhui:dark:text-slate-400">
                {percentage}%
              </span>
            )}
          </div>
        )}

        <div
          ref={ref}
          role="progressbar"
          aria-label={resolvedAriaLabel}
          aria-labelledby={resolvedAriaLabelledBy}
          aria-valuemin={0}
          aria-valuemax={safeMax}
          aria-valuenow={indeterminate ? undefined : clampedValue}
          aria-valuetext={indeterminate ? undefined : `${percentage}%`}
          data-indeterminate={indeterminate || undefined}
          className={cn(progressBarTrackVariants({ size }))}
          {...props}
        >
          <div
            className={cn(
              progressBarFillVariants({ variant, indeterminate: Boolean(indeterminate) }),
            )}
            style={indeterminate ? undefined : { width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  },
);

ProgressBar.displayName = 'ProgressBar';
