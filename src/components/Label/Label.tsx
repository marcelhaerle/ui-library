import { forwardRef, type LabelHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

export const labelVariants = cva(
  [
    'mhui:inline-flex mhui:items-center mhui:gap-1 mhui:font-medium mhui:select-none',
    'mhui:text-slate-900 mhui:dark:text-slate-100',
    'mhui:transition-colors mhui:duration-150',
  ],
  {
    variants: {
      size: {
        sm: 'mhui:text-xs',
        md: 'mhui:text-sm',
        lg: 'mhui:text-base',
      },
      disabled: {
        true: 'mhui:cursor-not-allowed mhui:opacity-50',
        false: 'mhui:cursor-pointer',
      },
    },
    defaultVariants: {
      size: 'md',
      disabled: false,
    },
  },
);

export type LabelSize = NonNullable<VariantProps<typeof labelVariants>['size']>;

export interface LabelProps
  extends LabelHTMLAttributes<HTMLLabelElement>, VariantProps<typeof labelVariants> {
  /** Whether the associated field is required */
  required?: boolean;
  /** Whether the associated field is disabled */
  disabled?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ size = 'md', required = false, disabled = false, className, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          labelVariants({
            size,
            disabled,
          }),
          className,
        )}
        {...props}
      >
        {children}
        {required && (
          <span
            aria-hidden="true"
            className="mhui:font-semibold mhui:text-red-700 mhui:dark:text-red-400"
          >
            *
          </span>
        )}
      </label>
    );
  },
);

Label.displayName = 'Label';
