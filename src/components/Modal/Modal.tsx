'use client';

import { forwardRef, useEffect, useId, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

export const modalPanelVariants = cva(
  [
    'mhui:relative mhui:z-10 mhui:flex mhui:w-full mhui:flex-col mhui:gap-5',
    'mhui:rounded-none mhui:border-t-4 mhui:border-t-blue-900 mhui:bg-white mhui:p-6 mhui:text-slate-900 mhui:shadow-2xl',
    'mhui:focus:outline-none',
    'mhui:dark:border-t-blue-500 mhui:dark:bg-slate-900 mhui:dark:text-slate-100 mhui:dark:shadow-black/70',
  ],
  {
    variants: {
      size: {
        sm: 'mhui:max-w-sm',
        md: 'mhui:max-w-lg',
        lg: 'mhui:max-w-2xl',
        xl: 'mhui:max-w-4xl',
        full: 'mhui:h-full mhui:max-h-full mhui:max-w-none',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export type ModalSize = NonNullable<VariantProps<typeof modalPanelVariants>['size']>;

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not(:disabled)',
  'input:not(:disabled)',
  'select:not(:disabled)',
  'textarea:not(:disabled)',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export interface ModalProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, VariantProps<typeof modalPanelVariants> {
  /** Controls whether the modal dialog is open */
  open: boolean;
  /** Callback invoked when the modal requests to open or close */
  onOpenChange?: (open: boolean) => void;
  /** Width preset of the modal dialog */
  size?: ModalSize;
  /** Whether clicking the backdrop overlay closes the modal */
  closeOnOverlayClick?: boolean;
  /** Whether pressing the Escape key closes the modal */
  closeOnEscape?: boolean;
  /** Optional heading rendered in the modal header */
  title?: ReactNode;
  /** Optional supporting description rendered below the title */
  description?: ReactNode;
  /** Renders the top-right close button when true */
  showCloseButton?: boolean;
  /** Accessible label for the close button */
  closeLabel?: string;
  /** Whether to render inside `document.body` via React Portal */
  portal?: boolean;
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      onOpenChange,
      size = 'md',
      closeOnOverlayClick = true,
      closeOnEscape = true,
      title,
      description,
      showCloseButton = true,
      closeLabel = 'Close dialog',
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

    const titleId = `mhui-modal-title-${generatedId}`;
    const descriptionId = `mhui-modal-description-${generatedId}`;

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

    const modalContent = (
      <div
        ref={overlayRef}
        data-testid="modal-overlay"
        className={cn(
          'mhui:fixed mhui:inset-0 mhui:z-50 mhui:flex mhui:items-center mhui:justify-center',
          'mhui:bg-slate-950/60 mhui:backdrop-blur-[1px]',
          size === 'full' ? 'mhui:p-0' : 'mhui:p-4 mhui:sm:p-6',
        )}
      >
        <div
          ref={setPanelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={resolvedLabelledBy}
          aria-describedby={resolvedDescribedBy}
          tabIndex={-1}
          className={cn(modalPanelVariants({ size }), className)}
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
      return createPortal(modalContent, document.body);
    }

    return modalContent;
  },
);

Modal.displayName = 'Modal';

export type ModalHeaderProps = HTMLAttributes<HTMLDivElement>;

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('mhui:flex mhui:flex-col mhui:gap-1.5', className)} {...props}>
        {children}
      </div>
    );
  },
);

ModalHeader.displayName = 'ModalHeader';

export type ModalBodyProps = HTMLAttributes<HTMLDivElement>;

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
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

ModalBody.displayName = 'ModalBody';

export const modalFooterVariants = cva('mhui:flex mhui:items-center mhui:gap-3 mhui:pt-2', {
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

export type ModalFooterAlign = NonNullable<VariantProps<typeof modalFooterVariants>['align']>;

export interface ModalFooterProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof modalFooterVariants> {
  /** Horizontal alignment of footer actions */
  align?: ModalFooterAlign;
}

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ align = 'end', className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(modalFooterVariants({ align }), className)} {...props}>
        {children}
      </div>
    );
  },
);

ModalFooter.displayName = 'ModalFooter';
