'use client';

import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export type AccordionType = 'single' | 'multiple';
export type AccordionValue = string | string[];

export const accordionItemVariants = cva(
  'mhui:flex mhui:flex-col mhui:rounded-none mhui:transition-colors mhui:duration-150',
  {
    variants: {
      variant: {
        subtle: 'mhui:bg-slate-50 mhui:dark:bg-slate-900/60',
        filled: 'mhui:bg-slate-100 mhui:dark:bg-slate-800',
        elevated: 'mhui:bg-white mhui:shadow-sm mhui:dark:bg-slate-900 mhui:dark:shadow-black/40',
      },
      open: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'subtle',
        open: true,
        className: 'mhui:bg-slate-100/90 mhui:dark:bg-slate-900',
      },
    ],
    defaultVariants: {
      variant: 'subtle',
      open: false,
    },
  },
);

export type AccordionVariant = NonNullable<VariantProps<typeof accordionItemVariants>['variant']>;

interface AccordionContextValue {
  type: AccordionType;
  openValues: string[];
  toggleItem: (itemValue: string) => void;
  navigateTrigger: (currentButton: HTMLButtonElement, key: string) => void;
  disabled: boolean;
  variant: AccordionVariant;
}

const AccordionContext = createContext<AccordionContextValue | undefined>(undefined);

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
  disabled: boolean;
  triggerId: string;
  contentId: string;
}

const AccordionItemContext = createContext<AccordionItemContextValue | undefined>(undefined);

const normalizeToArray = (val: AccordionValue | undefined): string[] => {
  if (val === undefined) return [];
  if (Array.isArray(val)) return val;
  return val.length > 0 ? [val] : [];
};

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether a single item or multiple items can be expanded simultaneously */
  type?: AccordionType;
  /** Controlled expanded value(s) */
  value?: AccordionValue;
  /** Initial expanded value(s) for uncontrolled usage */
  defaultValue?: AccordionValue;
  /** Callback invoked when expanded item(s) change */
  onValueChange?: (value: AccordionValue) => void;
  /** Allows closing the currently open item in `'single'` mode */
  collapsible?: boolean;
  /** Disables all accordion items */
  disabled?: boolean;
  /** Surface appearance of accordion items */
  variant?: AccordionVariant;
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      type = 'single',
      value,
      defaultValue,
      onValueChange,
      collapsible = true,
      disabled = false,
      variant = 'subtle',
      className,
      children,
      ...props
    },
    forwardedRef,
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const isControlled = value !== undefined;
    const [uncontrolledValues, setUncontrolledValues] = useState<string[]>(() =>
      normalizeToArray(defaultValue),
    );

    const openValues = isControlled ? normalizeToArray(value) : uncontrolledValues;

    const setRefs = (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    };

    const toggleItem = (itemValue: string) => {
      const isCurrentlyOpen = openValues.includes(itemValue);

      if (type === 'single') {
        if (isCurrentlyOpen && !collapsible) {
          return;
        }
        const nextSingleValue = isCurrentlyOpen ? '' : itemValue;
        const nextArray = nextSingleValue ? [nextSingleValue] : [];
        if (!isControlled) {
          setUncontrolledValues(nextArray);
        }
        onValueChange?.(nextSingleValue);
      } else {
        const nextArray = isCurrentlyOpen
          ? openValues.filter((v) => v !== itemValue)
          : [...openValues, itemValue];
        if (!isControlled) {
          setUncontrolledValues(nextArray);
        }
        onValueChange?.(nextArray);
      }
    };

    const navigateTrigger = (currentButton: HTMLButtonElement, key: string) => {
      const triggers = Array.from(
        containerRef.current?.querySelectorAll<HTMLButtonElement>(
          'button[data-accordion-trigger="true"]:not(:disabled)',
        ) ?? [],
      );

      if (triggers.length === 0) {
        return;
      }

      const currentIndex = triggers.indexOf(currentButton);
      if (currentIndex === -1) {
        return;
      }

      let nextIndex: number | null = null;

      if (key === 'ArrowDown') {
        nextIndex = (currentIndex + 1) % triggers.length;
      } else if (key === 'ArrowUp') {
        nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;
      } else if (key === 'Home') {
        nextIndex = 0;
      } else if (key === 'End') {
        nextIndex = triggers.length - 1;
      }

      if (nextIndex !== null) {
        triggers[nextIndex]?.focus();
      }
    };

    return (
      <AccordionContext.Provider
        value={{
          type,
          openValues,
          toggleItem,
          navigateTrigger,
          disabled,
          variant,
        }}
      >
        <div
          ref={setRefs}
          className={cn('mhui:flex mhui:w-full mhui:flex-col mhui:gap-2', className)}
          {...props}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  },
);

Accordion.displayName = 'Accordion';

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Unique identifier for this accordion section */
  value: string;
  /** Disables interaction for this specific item */
  disabled?: boolean;
}

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, disabled = false, className, children, ...props }, ref) => {
    const accordion = useContext(AccordionContext);
    const generatedId = useId();

    if (!accordion) {
      throw new Error('AccordionItem must be used within an Accordion component.');
    }

    const isOpen = accordion.openValues.includes(value);
    const isDisabled = Boolean(accordion.disabled || disabled);
    const triggerId = `mhui-accordion-trigger-${generatedId}`;
    const contentId = `mhui-accordion-content-${generatedId}`;

    return (
      <AccordionItemContext.Provider
        value={{
          value,
          isOpen,
          disabled: isDisabled,
          triggerId,
          contentId,
        }}
      >
        <div
          ref={ref}
          data-state={isOpen ? 'open' : 'closed'}
          data-disabled={isDisabled || undefined}
          className={cn(
            accordionItemVariants({ variant: accordion.variant, open: isOpen }),
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  },
);

AccordionItem.displayName = 'AccordionItem';

export type AccordionTriggerProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, disabled, onClick, onKeyDown, children, ...props }, ref) => {
    const accordion = useContext(AccordionContext);
    const item = useContext(AccordionItemContext);

    if (!accordion || !item) {
      throw new Error('AccordionTrigger must be used within an AccordionItem.');
    }

    const isDisabled = Boolean(item.disabled || disabled);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      if (!isDisabled) {
        accordion.toggleItem(item.value);
      }
      onClick?.(event);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || isDisabled) {
        return;
      }
      if (
        event.key === 'ArrowDown' ||
        event.key === 'ArrowUp' ||
        event.key === 'Home' ||
        event.key === 'End'
      ) {
        event.preventDefault();
        accordion.navigateTrigger(event.currentTarget, event.key);
      }
    };

    return (
      <h3 className="mhui:m-0 mhui:flex">
        <button
          ref={ref}
          id={item.triggerId}
          type="button"
          disabled={isDisabled}
          aria-expanded={item.isOpen}
          aria-controls={item.contentId}
          data-state={item.isOpen ? 'open' : 'closed'}
          data-accordion-trigger="true"
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className={cn(
            'mhui:flex mhui:w-full mhui:items-center mhui:justify-between mhui:gap-4 mhui:px-5 mhui:py-4',
            'mhui:rounded-none mhui:text-left mhui:text-sm mhui:font-semibold',
            'mhui:text-slate-900 mhui:transition-colors mhui:duration-150 mhui:dark:text-slate-100',
            'mhui:hover:bg-slate-200/60 mhui:dark:hover:bg-slate-800/80',
            'mhui:focus-visible:ring-2 mhui:focus-visible:ring-blue-900 mhui:focus-visible:outline-none mhui:focus-visible:ring-inset mhui:dark:focus-visible:ring-blue-400',
            'mhui:disabled:cursor-not-allowed mhui:disabled:opacity-50 mhui:disabled:hover:bg-transparent',
            item.isOpen && 'mhui:text-blue-900 mhui:dark:text-blue-400',
            className,
          )}
          {...props}
        >
          <span>{children}</span>
          <ChevronDown
            aria-hidden="true"
            className={cn(
              'mhui:h-4 mhui:w-4 mhui:shrink-0 mhui:text-slate-500 mhui:transition-transform mhui:duration-200 mhui:dark:text-slate-400',
              item.isOpen && 'mhui:rotate-180 mhui:text-blue-900 mhui:dark:text-blue-400',
            )}
          />
        </button>
      </h3>
    );
  },
);

AccordionTrigger.displayName = 'AccordionTrigger';

export type AccordionContentProps = HTMLAttributes<HTMLDivElement>;

export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const item = useContext(AccordionItemContext);

    if (!item) {
      throw new Error('AccordionContent must be used within an AccordionItem.');
    }

    return (
      <div
        ref={ref}
        id={item.contentId}
        role="region"
        aria-labelledby={item.triggerId}
        hidden={!item.isOpen}
        data-state={item.isOpen ? 'open' : 'closed'}
        className={cn(
          'mhui:px-5 mhui:pt-1 mhui:pb-5 mhui:text-sm mhui:leading-relaxed mhui:text-slate-700 mhui:dark:text-slate-300',
          !item.isOpen && 'mhui:hidden',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

AccordionContent.displayName = 'AccordionContent';
