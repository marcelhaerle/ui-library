import { forwardRef, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

export const spinnerVariants = cva(
  'mhui:inline-flex mhui:shrink-0 mhui:items-center mhui:justify-center',
  {
    variants: {
      size: {
        xs: 'mhui:h-3.5 mhui:w-3.5',
        sm: 'mhui:h-4 mhui:w-4',
        md: 'mhui:h-6 mhui:w-6',
        lg: 'mhui:h-8 mhui:w-8',
        xl: 'mhui:h-12 mhui:w-12',
      },
      variant: {
        primary: 'mhui:text-blue-900 mhui:dark:text-blue-400',
        secondary: 'mhui:text-emerald-800 mhui:dark:text-emerald-400',
        current: 'mhui:text-current',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'primary',
    },
  },
);

export type SpinnerSize = NonNullable<VariantProps<typeof spinnerVariants>['size']>;
export type SpinnerVariant = NonNullable<VariantProps<typeof spinnerVariants>['variant']>;

export interface SpinnerProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof spinnerVariants> {
  /** Accessible screen-reader text */
  label?: string;
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ size = 'md', variant = 'primary', label = 'Loading...', className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        role="status"
        aria-label={label}
        className={cn(
          spinnerVariants({
            size,
            variant,
          }),
          className,
        )}
        {...props}
      >
        <svg
          className="mhui:h-full mhui:w-full mhui:animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle
            className="mhui:opacity-20"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            d="M22 12C22 6.47715 17.5228 2 12 2"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="butt"
          />
        </svg>
        <span className="mhui:sr-only">{label}</span>
      </span>
    );
  },
);

Spinner.displayName = 'Spinner';
