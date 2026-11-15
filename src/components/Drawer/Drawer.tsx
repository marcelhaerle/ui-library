'use client';

import { forwardRef, useEffect, useId, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

export const drawerPanelVariants = cva(
  [
    'mhui:fixed mhui:z-50 mhui:flex mhui:flex-col mhui:gap-5 mhui:p-6',
    'mhui:rounded-none mhui:bg-white mhui:text-slate-900 mhui:shadow-2xl mhui:focus:outline-none',
    'mhui:dark:bg-slate-900 mhui:dark:text-slate-100 mhui:dark:shadow-black/70',
  ],
  {
    variants: {
      side: {
        right:
          'mhui:inset-y-0 mhui:right-0 mhui:h-full mhui:border-l-4 mhui:border-l-blue-900 mhui:dark:border-l-blue-500',
        left: 'mhui:inset-y-0 mhui:left-0 mhui:h-full mhui:border-r-4 mhui:border-r-blue-900 mhui:dark:border-r-blue-500',
        top: 'mhui:inset-x-0 mhui:top-0 mhui:w-full mhui:border-b-4 mhui:border-b-blue-900 mhui:dark:border-b-blue-500',
        bottom:
          'mhui:inset-x-0 mhui:bottom-0 mhui:w-full mhui:border-t-4 mhui:border-t-blue-900 mhui:dark:border-t-blue-500',
      },
      size: {
        sm: '',
        md: '',
        lg: '',
        xl: '',
      },
    },
    compoundVariants: [
      {
        side: ['left', 'right'],
        size: 'sm',
        className: 'mhui:w-full mhui:max-w-xs',
      },
      {
        side: ['left', 'right'],
        size: 'md',
        className: 'mhui:w-full mhui:max-w-md',
      },
      {
        side: ['left', 'right'],
        size: 'lg',
        className: 'mhui:w-full mhui:max-w-xl',
      },
      {
        side: ['left', 'right'],
        size: 'xl',
        className: 'mhui:w-full mhui:max-w-2xl',
      },
      {
        side: ['top', 'bottom'],
        size: 'sm',
        className: 'mhui:max-h-64',
      },
      {
        side: ['top', 'bottom'],
        size: 'md',
        className: 'mhui:max-h-96',
      },
      {
        side: ['top', 'bottom'],
        size: 'lg',
        className: 'mhui:max-h-[32rem]',
      },
      {
        side: ['top', 'bottom'],
        size: 'xl',
        className: 'mhui:max-h-[40rem]',
      },
    ],
    defaultVariants: {
      side: 'right',
      size: 'md',
    },
  },
);

export type DrawerSide = NonNullable<VariantProps<typeof drawerPanelVariants>['side']>;
export type DrawerSize = NonNullable<VariantProps<typeof drawerPanelVariants>['size']>;

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not(:disabled)',
  'input:not(:disabled)',
  'select:not(:disabled)',
  'textarea:not(:disabled)',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export interface DrawerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, VariantProps<typeof drawerPanelVariants> {
  /** Controls whether the drawer panel is open */
  open: boolean;
  /** Callback invoked when the drawer requests to open or close */
  onOpenChange?: (open: boolean) => void;
  /** Viewport edge to anchor the drawer against */
  side?: DrawerSide;
  /** Width (for left/right) or height (for top/bottom) scale of the drawer */
  size?: DrawerSize;
  /** Optional heading rendered at the top of the drawer */
  title?: ReactNode;
  /** Optional supporting description rendered below the title */
  description?: ReactNode;
  /** Whether clicking the backdrop overlay closes the drawer */
  closeOnOverlayClick?: boolean;
  /** Whether pressing the Escape key closes the drawer */
  closeOnEscape?: boolean;
  /** Renders the top-right close button when true */
  showCloseButton?: boolean;
  /** Accessible label for the close button */
  closeLabel?: string;
  /** Whether to render inside `document.body` via React Portal */
  portal?: boolean;
}

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      open,
      onOpenChange,
      side = 'right',
      size = 'md',
      title,
      description,
      closeOnOverlayClick = true,
      closeOnEscape = true,
      showCloseButton = true,
      closeLabel = 'Close drawer',
      portal = true,
      className,
      children,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    forwardedRef,
  ) => {
    const generatedId = useId();
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const panelRef = useRef<HTMLDivElement | null>(null);
    const previousActiveElementRef = useRef<HTMLElement | null>(null);

    const titleId = `mhui-drawer-title-${generatedId}`;
    const descriptionId = `mhui-drawer-description-${generatedId}`;

    const resolvedLabelledBy = ariaLabelledBy ?? (title ? titleId : undefined);
    const resolvedDescribedBy = ariaDescribedBy ?? (description ? descriptionId : undefined);

    const setPanelRef = (node: HTMLDivElement | null) => {
      panelRef.current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    };

    useEffect(() => {
      if (!open || typeof document === 'undefined') {
        return;
      }

      previousActiveElementRef.current = document.activeElement as HTMLElement | null;
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const panelNode = panelRef.current;
      if (panelNode) {
        const focusables = panelNode.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        const initialTarget = focusables[0] ?? panelNode;
        initialTarget.focus();
      }

      return () => {
        document.body.style.overflow = previousOverflow;
        previousActiveElementRef.current?.focus?.();
      };
    }, [open]);

    useEffect(() => {
      if (!open || typeof document === 'undefined') {
        return;
      }

      const handleDocumentKeyDown = (event: globalThis.KeyboardEvent) => {
        if (event.defaultPrevented) {
          return;
        }

        if (event.key === 'Escape' && closeOnEscape) {
          event.preventDefault();
          event.stopPropagation();
          onOpenChange?.(false);
          return;
        }

        if (event.key === 'Tab' && panelRef.current) {
          const focusables = Array.from(
            panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
          );

          if (focusables.length === 0) {
            event.preventDefault();
            panelRef.current.focus();
            return;
          }

          const firstElement = focusables[0];
          const lastElement = focusables[focusables.length - 1];
          const activeElement = document.activeElement as HTMLElement | null;

          if (event.shiftKey) {
            if (
              activeElement === firstElement ||
              activeElement === panelRef.current ||
              !panelRef.current.contains(activeElement)
            ) {
              event.preventDefault();
              lastElement?.focus();
            }
          } else if (activeElement === lastElement || !panelRef.current.contains(activeElement)) {
            event.preventDefault();
            firstElement?.focus();
          }
        }
      };

      const handleDocumentMouseDown = (event: globalThis.MouseEvent) => {
        if (closeOnOverlayClick && overlayRef.current && event.target === overlayRef.current) {
          onOpenChange?.(false);
        }
      };

      document.addEventListener('keydown', handleDocumentKeyDown);
      document.addEventListener('mousedown', handleDocumentMouseDown);

      return () => {
        document.removeEventListener('keydown', handleDocumentKeyDown);
        document.removeEventListener('mousedown', handleDocumentMouseDown);
      };
    }, [open, closeOnEscape, closeOnOverlayClick, onOpenChange]);

    if (!open) {
      return null;
    }

    const drawerContent = (
      <div
        ref={overlayRef}
        data-testid="drawer-overlay"
        className="mhui:fixed mhui:inset-0 mhui:z-50 mhui:bg-slate-950/60 mhui:backdrop-blur-[1px]"
      >
        <div
          ref={setPanelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={resolvedLabelledBy}
          aria-describedby={resolvedDescribedBy}
          data-side={side}
          tabIndex={-1}
          className={cn(drawerPanelVariants({ side, size }), className)}
          {...props}
        >
          {(title || description || showCloseButton) && (
            <div className="mhui:flex mhui:items-start mhui:justify-between mhui:gap-4">
              <div className="mhui:flex mhui:min-w-0 mhui:flex-1 mhui:flex-col mhui:gap-1">
                {title && (
                  <h2
                    id={titleId}
                    className="mhui:text-lg mhui:leading-snug mhui:font-bold mhui:text-slate-900 mhui:dark:text-slate-100"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p
                    id={descriptionId}
                    className="mhui:text-sm mhui:leading-normal mhui:text-slate-600 mhui:dark:text-slate-400"
                  >
                    {description}
                  </p>
                )}
              </div>

              {showCloseButton && (
                <button
                  type="button"
                  aria-label={closeLabel}
                  onClick={() => onOpenChange?.(false)}
                  className={cn(
                    'mhui:-mt-1 mhui:-mr-1 mhui:inline-flex mhui:h-8 mhui:w-8 mhui:shrink-0 mhui:cursor-pointer mhui:items-center mhui:justify-center',
                    'mhui:rounded-none mhui:text-slate-500 mhui:transition-colors mhui:duration-150',
                    'mhui:hover:bg-slate-100 mhui:hover:text-slate-900',
                    'mhui:dark:text-slate-400 mhui:dark:hover:bg-slate-800 mhui:dark:hover:text-slate-100',
                    'mhui:focus-visible:ring-2 mhui:focus-visible:ring-blue-900 mhui:focus-visible:outline-none mhui:dark:focus-visible:ring-blue-400',
                  )}
                >
                  <X size={18} aria-hidden="true" />
                </button>
              )}
            </div>
          )}

          {children}
        </div>
      </div>
    );

    if (portal && typeof document !== 'undefined') {
      return createPortal(drawerContent, document.body);
    }

    return drawerContent;
  },
);

Drawer.displayName = 'Drawer';

export type DrawerHeaderProps = HTMLAttributes<HTMLDivElement>;

export const DrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('mhui:flex mhui:flex-col mhui:gap-1.5', className)} {...props}>
        {children}
      </div>
    );
  },
);

DrawerHeader.displayName = 'DrawerHeader';

export type DrawerBodyProps = HTMLAttributes<HTMLDivElement>;

export const DrawerBody = forwardRef<HTMLDivElement, DrawerBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'mhui:flex-1 mhui:overflow-y-auto mhui:text-sm mhui:leading-relaxed mhui:text-slate-700 mhui:dark:text-slate-300',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

DrawerBody.displayName = 'DrawerBody';

export const drawerFooterVariants = cva('mhui:flex mhui:items-center mhui:gap-3 mhui:pt-2', {
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

export type DrawerFooterAlign = NonNullable<VariantProps<typeof drawerFooterVariants>['align']>;

export interface DrawerFooterProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof drawerFooterVariants> {
  /** Horizontal alignment of footer actions */
  align?: DrawerFooterAlign;
}

export const DrawerFooter = forwardRef<HTMLDivElement, DrawerFooterProps>(
  ({ align = 'end', className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(drawerFooterVariants({ align }), className)} {...props}>
        {children}
      </div>
    );
  },
);

DrawerFooter.displayName = 'DrawerFooter';
