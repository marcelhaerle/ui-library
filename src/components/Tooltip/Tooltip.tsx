'use client';

import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type HTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

export const tooltipContentVariants = cva(
  [
    'mhui:pointer-events-none mhui:absolute mhui:z-50 mhui:w-max mhui:max-w-xs mhui:px-2.5 mhui:py-1.5',
    'mhui:rounded-none mhui:bg-blue-900 mhui:text-xs mhui:leading-snug mhui:font-medium mhui:text-white mhui:shadow-md',
    'mhui:dark:bg-slate-800 mhui:dark:text-slate-100 mhui:dark:shadow-black/60',
  ],
  {
    variants: {
      placement: {
        top: 'mhui:bottom-full mhui:left-1/2 mhui:mb-2 mhui:-translate-x-1/2',
        bottom: 'mhui:top-full mhui:left-1/2 mhui:mt-2 mhui:-translate-x-1/2',
        left: 'mhui:top-1/2 mhui:right-full mhui:mr-2 mhui:-translate-y-1/2',
        right: 'mhui:top-1/2 mhui:left-full mhui:ml-2 mhui:-translate-y-1/2',
      },
    },
    defaultVariants: {
      placement: 'top',
    },
  },
);

export type TooltipPlacement = NonNullable<
  VariantProps<typeof tooltipContentVariants>['placement']
>;

export interface TooltipProps
  extends
    Omit<HTMLAttributes<HTMLSpanElement>, 'content'>,
    VariantProps<typeof tooltipContentVariants> {
  /** Contextual hint content rendered inside the tooltip */
  content: ReactNode;
  /** Position of the tooltip relative to its trigger element */
  placement?: TooltipPlacement;
  /** Delay in milliseconds before showing the tooltip on hover */
  delayMs?: number;
  /** Disables the tooltip from appearing */
  disabled?: boolean;
  /** Controlled open state */
  open?: boolean;
  /** Initial open state for uncontrolled usage */
  defaultOpen?: boolean;
  /** Callback invoked when the open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Additional className applied to the tooltip popup surface */
  contentClassName?: string;
}

export const Tooltip = forwardRef<HTMLSpanElement, TooltipProps>(
  (
    {
      content,
      placement = 'top',
      delayMs = 200,
      disabled = false,
      open,
      defaultOpen = false,
      onOpenChange,
      contentClassName,
      className,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      children,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const tooltipId = `mhui-tooltip-${generatedId}`;
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isControlled = open !== undefined;
    const [uncontrolledOpen, setUncontrolledOpen] = useState<boolean>(Boolean(defaultOpen));
    const isOpen = !disabled && (isControlled ? Boolean(open) : uncontrolledOpen);

    const clearPendingTimer = useCallback(() => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }, []);

    const updateOpen = useCallback(
      (nextOpen: boolean) => {
        if (!isControlled) {
          setUncontrolledOpen(nextOpen);
        }
        onOpenChange?.(nextOpen);
      },
      [isControlled, onOpenChange],
    );

    useEffect(() => {
      return () => {
        clearPendingTimer();
      };
    }, [clearPendingTimer]);

    useEffect(() => {
      if (!isOpen || typeof document === 'undefined') {
        return;
      }

      const handleKeyDown = (event: globalThis.KeyboardEvent) => {
        if (event.key === 'Escape') {
          clearPendingTimer();
          updateOpen(false);
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [clearPendingTimer, isOpen, updateOpen]);

    const handleMouseEnter = (event: MouseEvent<HTMLSpanElement>) => {
      onMouseEnter?.(event);
      if (disabled) return;
      clearPendingTimer();
      if (delayMs <= 0) {
        updateOpen(true);
      } else {
        timeoutRef.current = setTimeout(() => {
          updateOpen(true);
        }, delayMs);
      }
    };

    const handleMouseLeave = (event: MouseEvent<HTMLSpanElement>) => {
      onMouseLeave?.(event);
      clearPendingTimer();
      updateOpen(false);
    };

    const handleFocus = (event: FocusEvent<HTMLSpanElement>) => {
      onFocus?.(event);
      if (disabled) return;
      clearPendingTimer();
      updateOpen(true);
    };

    const handleBlur = (event: FocusEvent<HTMLSpanElement>) => {
      onBlur?.(event);
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
        clearPendingTimer();
        updateOpen(false);
      }
    };

    const triggerContent = isValidElement<{ 'aria-describedby'?: string }>(children)
      ? cloneElement(children as ReactElement<{ 'aria-describedby'?: string }>, {
          'aria-describedby':
            [children.props['aria-describedby'], isOpen ? tooltipId : undefined]
              .filter(Boolean)
              .join(' ') || undefined,
        })
      : children;

    return (
      <span
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={cn('mhui:relative mhui:inline-flex', className)}
        {...props}
      >
        {triggerContent}
        {isOpen && content !== null && content !== undefined && (
          <span
            id={tooltipId}
            role="tooltip"
            data-placement={placement}
            className={cn(tooltipContentVariants({ placement }), contentClassName)}
          >
            {content}
          </span>
        )}
      </span>
    );
  },
);

Tooltip.displayName = 'Tooltip';
