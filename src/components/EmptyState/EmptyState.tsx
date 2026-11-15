import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export const emptyStateVariants = cva(
  [
    'mhui:w-full mhui:flex mhui:flex-col mhui:items-center mhui:justify-center mhui:text-center',
    'mhui:rounded-none mhui:bg-slate-50 mhui:dark:bg-slate-900/50',
  ],
  {
    variants: {
      size: {
        sm: 'mhui:px-4 mhui:py-8 mhui:gap-3',
        md: 'mhui:px-6 mhui:py-12 mhui:gap-4',
        lg: 'mhui:px-8 mhui:py-16 mhui:gap-5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export type EmptyStateSize = NonNullable<VariantProps<typeof emptyStateVariants>['size']>;

export interface EmptyStateProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, VariantProps<typeof emptyStateVariants> {
  /** Optional leading Lucide icon */
  icon?: LucideIcon;
  /** Primary heading explaining the empty state */
  title: ReactNode;
  /** Supporting message or guidance */
  description?: ReactNode;
  /** Call-to-action element (e.g., a primary `Button`) */
  action?: ReactNode;
}

const iconBoxSizeMap: Record<EmptyStateSize, string> = {
  sm: 'mhui:h-10 mhui:w-10',
  md: 'mhui:h-12 mhui:w-12',
  lg: 'mhui:h-16 mhui:w-16',
};

const iconSizeMap: Record<EmptyStateSize, string> = {
  sm: 'mhui:h-5 mhui:w-5',
  md: 'mhui:h-6 mhui:w-6',
  lg: 'mhui:h-8 mhui:w-8',
};

const titleSizeMap: Record<EmptyStateSize, string> = {
  sm: 'mhui:text-sm',
  md: 'mhui:text-base',
  lg: 'mhui:text-lg',
};

const descriptionSizeMap: Record<EmptyStateSize, string> = {
  sm: 'mhui:text-xs',
  md: 'mhui:text-sm',
  lg: 'mhui:text-base',
};

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, size = 'md', icon: Icon, title, description, action, children, ...props }, ref) => {
    const resolvedSize: EmptyStateSize = size ?? 'md';

    return (
      <div
        ref={ref}
        className={cn(emptyStateVariants({ size: resolvedSize }), className)}
        {...props}
      >
        {Icon && (
          <div
            aria-hidden="true"
            className={cn(
              'mhui:inline-flex mhui:items-center mhui:justify-center mhui:rounded-none',
              'mhui:bg-blue-900/10 mhui:text-blue-900 mhui:dark:bg-blue-900/30 mhui:dark:text-blue-300',
              iconBoxSizeMap[resolvedSize],
            )}
          >
            <Icon className={cn('mhui:shrink-0', iconSizeMap[resolvedSize])} />
          </div>
        )}

        <div className="mhui:flex mhui:max-w-md mhui:flex-col mhui:items-center mhui:gap-1.5">
          <h3
            className={cn(
              'mhui:font-semibold mhui:text-slate-900 mhui:dark:text-slate-100',
              titleSizeMap[resolvedSize],
            )}
          >
            {title}
          </h3>

          {description && (
            <p
              className={cn(
                'mhui:text-slate-600 mhui:dark:text-slate-400',
                descriptionSizeMap[resolvedSize],
              )}
            >
              {description}
            </p>
          )}
        </div>

        {action && <div className="mhui:mt-1 mhui:flex mhui:items-center mhui:gap-2">{action}</div>}

        {children}
      </div>
    );
  },
);

EmptyState.displayName = 'EmptyState';
