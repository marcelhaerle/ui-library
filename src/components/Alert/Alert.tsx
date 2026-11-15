'use client';

import { forwardRef, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X, type LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export const alertVariants = cva(
  [
    'mhui:relative mhui:flex mhui:w-full mhui:items-start mhui:gap-3.5 mhui:px-5 mhui:py-4',
    'mhui:rounded-none mhui:border-l-4 mhui:text-sm',
  ],
  {
    variants: {
      variant: {
        info: [
          'mhui:border-l-blue-900 mhui:bg-blue-950/5 mhui:text-slate-900',
          'mhui:dark:border-l-blue-400 mhui:dark:bg-blue-950/40 mhui:dark:text-slate-100',
        ],
        success: [
          'mhui:border-l-emerald-800 mhui:bg-emerald-950/5 mhui:text-slate-900',
          'mhui:dark:border-l-emerald-400 mhui:dark:bg-emerald-950/40 mhui:dark:text-slate-100',
        ],
        warning: [
          'mhui:border-l-amber-600 mhui:bg-amber-950/5 mhui:text-slate-900',
          'mhui:dark:border-l-amber-400 mhui:dark:bg-amber-950/40 mhui:dark:text-slate-100',
        ],
        danger: [
          'mhui:border-l-red-700 mhui:bg-red-950/5 mhui:text-slate-900',
          'mhui:dark:border-l-red-400 mhui:dark:bg-red-950/40 mhui:dark:text-slate-100',
        ],
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
);

export type AlertVariant = NonNullable<VariantProps<typeof alertVariants>['variant']>;

const defaultVariantIcons: Record<AlertVariant, LucideIcon> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertCircle,
};

const iconColorMap: Record<AlertVariant, string> = {
  info: 'mhui:text-blue-900 mhui:dark:text-blue-400',
  success: 'mhui:text-emerald-800 mhui:dark:text-emerald-400',
  warning: 'mhui:text-amber-600 mhui:dark:text-amber-400',
  danger: 'mhui:text-red-700 mhui:dark:text-red-400',
};

export interface AlertProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, VariantProps<typeof alertVariants> {
  /** Contextual status tone of the alert banner */
  variant?: AlertVariant;
  /** Primary heading displayed at the top of the alert */
  title?: ReactNode;
  /** Custom Lucide icon, `true` for the default variant icon, or `false` to hide the icon */
  icon?: LucideIcon | boolean;
  /** Renders a dismiss button (`×`) on the right edge */
  dismissible?: boolean;
  /** Accessible label for the dismiss button */
  dismissLabel?: string;
  /** Callback invoked when the dismiss button is clicked */
  onDismiss?: () => void;
  /** Optional interactive action element (e.g., a `Button`) */
  action?: ReactNode;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = 'info',
      title,
      icon = true,
      dismissible = false,
      dismissLabel = 'Dismiss alert',
      onDismiss,
      action,
      role,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const resolvedVariant: AlertVariant = variant ?? 'info';
    const resolvedRole =
      role ?? (resolvedVariant === 'danger' || resolvedVariant === 'warning' ? 'alert' : 'status');

    const ResolvedIcon: LucideIcon | null =
      icon === false
        ? null
        : icon === true || icon === undefined
          ? defaultVariantIcons[resolvedVariant]
          : icon;

    const handleDismissClick = (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onDismiss?.();
    };

    return (
      <div
        ref={ref}
        role={resolvedRole}
        className={cn(alertVariants({ variant: resolvedVariant }), className)}
        {...props}
      >
        {ResolvedIcon && (
          <ResolvedIcon
            aria-hidden="true"
            className={cn(
              'mhui:mt-0.5 mhui:h-5 mhui:w-5 mhui:shrink-0',
              iconColorMap[resolvedVariant],
            )}
          />
        )}

        <div className="mhui:flex mhui:min-w-0 mhui:flex-1 mhui:flex-col mhui:gap-1">
          {title && (
            <div className="mhui:text-sm mhui:leading-snug mhui:font-semibold mhui:text-slate-900 mhui:dark:text-slate-100">
              {title}
            </div>
          )}
          {children && (
            <div className="mhui:text-sm mhui:leading-relaxed mhui:text-slate-700 mhui:dark:text-slate-300">
              {children}
            </div>
          )}
          {action && <div className="mhui:mt-2 mhui:flex mhui:items-center">{action}</div>}
        </div>

        {dismissible && (
          <button
            type="button"
            aria-label={dismissLabel}
            onClick={handleDismissClick}
            className={cn(
              'mhui:-mt-1 mhui:-mr-1 mhui:inline-flex mhui:h-7 mhui:w-7 mhui:shrink-0 mhui:cursor-pointer mhui:items-center mhui:justify-center',
              'mhui:rounded-none mhui:text-slate-500 mhui:transition-colors mhui:duration-150',
              'mhui:hover:bg-slate-200/70 mhui:hover:text-slate-900',
              'mhui:dark:text-slate-400 mhui:dark:hover:bg-slate-800 mhui:dark:hover:text-slate-100',
              'mhui:focus-visible:ring-2 mhui:focus-visible:ring-blue-900 mhui:focus-visible:outline-none mhui:dark:focus-visible:ring-blue-400',
            )}
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </div>
    );
  },
);

Alert.displayName = 'Alert';
