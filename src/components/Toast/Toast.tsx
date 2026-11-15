'use client';

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X, type LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export const toastVariants = cva(
  [
    'mhui:pointer-events-auto mhui:relative mhui:flex mhui:w-full mhui:max-w-sm mhui:items-start mhui:gap-3.5 mhui:p-4',
    'mhui:rounded-none mhui:border-l-4 mhui:bg-white mhui:text-slate-900 mhui:shadow-lg',
    'mhui:dark:bg-slate-900 mhui:dark:text-slate-100 mhui:dark:shadow-black/60',
  ],
  {
    variants: {
      variant: {
        info: 'mhui:border-l-blue-900 mhui:dark:border-l-blue-400',
        success: 'mhui:border-l-emerald-800 mhui:dark:border-l-emerald-400',
        warning: 'mhui:border-l-amber-600 mhui:dark:border-l-amber-400',
        danger: 'mhui:border-l-red-700 mhui:dark:border-l-red-400',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
);

export const toasterVariants = cva(
  'mhui:pointer-events-none mhui:fixed mhui:z-50 mhui:flex mhui:w-full mhui:max-w-sm mhui:flex-col mhui:gap-3 mhui:p-4',
  {
    variants: {
      position: {
        'top-right': 'mhui:top-0 mhui:right-0',
        'top-left': 'mhui:top-0 mhui:left-0',
        'bottom-right': 'mhui:right-0 mhui:bottom-0',
        'bottom-left': 'mhui:bottom-0 mhui:left-0',
      },
    },
    defaultVariants: {
      position: 'bottom-right',
    },
  },
);

export type ToastVariant = NonNullable<VariantProps<typeof toastVariants>['variant']>;
export type ToastPosition = NonNullable<VariantProps<typeof toasterVariants>['position']>;

export interface ToastAction {
  label: string;
  onClick: () => void;
}

const variantIcons: Record<ToastVariant, LucideIcon> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertCircle,
};

const variantIconColors: Record<ToastVariant, string> = {
  info: 'mhui:text-blue-900 mhui:dark:text-blue-400',
  success: 'mhui:text-emerald-800 mhui:dark:text-emerald-400',
  warning: 'mhui:text-amber-600 mhui:dark:text-amber-400',
  danger: 'mhui:text-red-700 mhui:dark:text-red-400',
};

export interface ToastProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, VariantProps<typeof toastVariants> {
  /** Contextual status tone of the toast notification */
  variant?: ToastVariant;
  /** Primary heading of the toast */
  title?: ReactNode;
  /** Supporting message rendered below the title */
  description?: ReactNode;
  /** Auto-dismiss timeout in milliseconds (default: `5000`; `0` disables auto-dismiss) */
  duration?: number;
  /** Optional interactive action button configuration */
  action?: ToastAction;
  /** Whether a dismiss button is rendered */
  dismissible?: boolean;
  /** Accessible label for the dismiss button */
  dismissLabel?: string;
  /** Callback invoked when the toast is dismissed manually or by timer */
  onDismiss?: () => void;
  /** Controls visibility of the toast */
  open?: boolean;
}

export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      variant = 'info',
      title,
      description,
      duration = 5000,
      action,
      dismissible = true,
      dismissLabel = 'Dismiss notification',
      onDismiss,
      open = true,
      role,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const resolvedVariant: ToastVariant = variant ?? 'info';
    const resolvedRole =
      role ?? (resolvedVariant === 'danger' || resolvedVariant === 'warning' ? 'alert' : 'status');
    const IconComponent = variantIcons[resolvedVariant];

    useEffect(() => {
      if (!open || !onDismiss || duration <= 0 || !Number.isFinite(duration)) {
        return;
      }

      const timer = setTimeout(() => {
        onDismiss();
      }, duration);

      return () => {
        clearTimeout(timer);
      };
    }, [duration, onDismiss, open]);

    if (!open) {
      return null;
    }

    return (
      <div
        ref={ref}
        role={resolvedRole}
        className={cn(toastVariants({ variant: resolvedVariant }), className)}
        {...props}
      >
        <IconComponent
          aria-hidden="true"
          className={cn(
            'mhui:mt-0.5 mhui:h-5 mhui:w-5 mhui:shrink-0',
            variantIconColors[resolvedVariant],
          )}
        />

        <div className="mhui:flex mhui:min-w-0 mhui:flex-1 mhui:flex-col mhui:gap-1">
          {title && (
            <div className="mhui:text-sm mhui:leading-snug mhui:font-semibold mhui:text-slate-900 mhui:dark:text-slate-100">
              {title}
            </div>
          )}
          {description && (
            <div className="mhui:text-xs mhui:leading-relaxed mhui:text-slate-600 mhui:dark:text-slate-400">
              {description}
            </div>
          )}
          {children}
          {action && (
            <div className="mhui:mt-1.5">
              <button
                type="button"
                onClick={action.onClick}
                className={cn(
                  'mhui:inline-flex mhui:cursor-pointer mhui:items-center mhui:px-2.5 mhui:py-1',
                  'mhui:rounded-none mhui:bg-slate-100 mhui:text-xs mhui:font-semibold mhui:text-slate-900 mhui:transition-colors mhui:duration-150',
                  'mhui:hover:bg-blue-900 mhui:hover:text-white',
                  'mhui:dark:bg-slate-800 mhui:dark:text-slate-100 mhui:dark:hover:bg-blue-700',
                  'mhui:focus-visible:ring-2 mhui:focus-visible:ring-blue-900 mhui:focus-visible:outline-none mhui:dark:focus-visible:ring-blue-400',
                )}
              >
                {action.label}
              </button>
            </div>
          )}
        </div>

        {dismissible && (
          <button
            type="button"
            aria-label={dismissLabel}
            onClick={onDismiss}
            className={cn(
              'mhui:-mt-1 mhui:-mr-1 mhui:inline-flex mhui:h-7 mhui:w-7 mhui:shrink-0 mhui:cursor-pointer mhui:items-center mhui:justify-center',
              'mhui:rounded-none mhui:text-slate-500 mhui:transition-colors mhui:duration-150',
              'mhui:hover:bg-slate-100 mhui:hover:text-slate-900',
              'mhui:dark:text-slate-400 mhui:dark:hover:bg-slate-800 mhui:dark:hover:text-slate-100',
              'mhui:focus-visible:ring-2 mhui:focus-visible:ring-blue-900 mhui:focus-visible:outline-none mhui:dark:focus-visible:ring-blue-400',
            )}
          >
            <X size={15} aria-hidden="true" />
          </button>
        )}
      </div>
    );
  },
);

Toast.displayName = 'Toast';

export interface ToastItem {
  id: string;
  variant?: ToastVariant;
  title?: ReactNode;
  description?: ReactNode;
  duration?: number;
  action?: ToastAction;
}

export interface ToasterProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof toasterVariants> {
  /** Active toast items to render in the viewport queue */
  toasts?: ToastItem[];
  /** Viewport corner placement */
  position?: ToastPosition;
  /** Callback invoked when a toast in the queue requests dismissal */
  onDismiss?: (id: string) => void;
}

export const Toaster = forwardRef<HTMLDivElement, ToasterProps>(
  ({ toasts, position = 'bottom-right', onDismiss, className, children, ...props }, ref) => {
    const context = useContext(ToastContext);
    const resolvedToasts = toasts ?? context?.toasts ?? [];
    const resolvedPosition = position ?? context?.position ?? 'bottom-right';
    const resolvedDismiss = onDismiss ?? context?.dismiss;

    return (
      <div
        ref={ref}
        aria-live="polite"
        aria-label="Notifications"
        data-position={resolvedPosition}
        className={cn(toasterVariants({ position: resolvedPosition }), className)}
        {...props}
      >
        {resolvedToasts.map((item) => (
          <Toast
            key={item.id}
            variant={item.variant}
            title={item.title}
            description={item.description}
            duration={item.duration}
            action={item.action}
            onDismiss={() => resolvedDismiss?.(item.id)}
          />
        ))}
        {children}
      </div>
    );
  },
);

Toaster.displayName = 'Toaster';

export type CreateToastOptions = Omit<ToastItem, 'id'> & { id?: string };

interface ToastContextValue {
  toasts: ToastItem[];
  position: ToastPosition;
  toast: (options: CreateToastOptions) => string;
  dismiss: (id: string) => void;
  clear: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

let toastCounter = 0;

export interface ToastProviderProps {
  /** Default corner position for the rendered Toaster */
  position?: ToastPosition;
  /** Whether to automatically mount a `<Toaster />` container */
  renderToaster?: boolean;
  children: ReactNode;
}

export const ToastProvider = ({
  position = 'bottom-right',
  renderToaster = true,
  children,
}: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clear = useCallback(() => {
    setToasts([]);
  }, []);

  const toast = useCallback((options: CreateToastOptions): string => {
    toastCounter += 1;
    const id = options.id ?? `mhui-toast-${toastCounter}`;
    setToasts((prev) => [...prev, { ...options, id }]);
    return id;
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, position, toast, dismiss, clear }}>
      {children}
      {renderToaster && <Toaster position={position} />}
    </ToastContext.Provider>
  );
};

ToastProvider.displayName = 'ToastProvider';

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider.');
  }
  return context;
};
