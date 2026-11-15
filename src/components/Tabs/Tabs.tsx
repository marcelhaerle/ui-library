'use client';

import {
  createContext,
  forwardRef,
  useCallback,
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
import { cn } from '../../utils/cn';

export type TabsVariant = 'underline' | 'solid';
export type TabsSize = 'sm' | 'md' | 'lg';
export type TabsOrientation = 'horizontal' | 'vertical';

export const tabListVariants = cva('mhui:flex mhui:rounded-none', {
  variants: {
    variant: {
      underline: 'mhui:gap-2 mhui:bg-slate-100/70 mhui:p-1 mhui:dark:bg-slate-900/60',
      solid: 'mhui:gap-1 mhui:bg-slate-100 mhui:p-1 mhui:dark:bg-slate-900',
    },
    orientation: {
      horizontal: 'mhui:flex-row mhui:items-center',
      vertical: 'mhui:flex-col mhui:items-stretch mhui:self-start',
    },
  },
  defaultVariants: {
    variant: 'underline',
    orientation: 'horizontal',
  },
});

export const tabTriggerVariants = cva(
  [
    'mhui:inline-flex mhui:cursor-pointer mhui:items-center mhui:justify-center mhui:gap-2',
    'mhui:rounded-none mhui:font-semibold mhui:whitespace-nowrap mhui:transition-colors mhui:duration-150',
    'mhui:focus-visible:ring-2 mhui:focus-visible:ring-blue-900 mhui:focus-visible:outline-none mhui:focus-visible:ring-inset mhui:dark:focus-visible:ring-blue-400',
    'mhui:disabled:cursor-not-allowed mhui:disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        underline: 'mhui:border-b-2 mhui:border-transparent',
        solid: '',
      },
      size: {
        sm: 'mhui:px-3 mhui:py-1.5 mhui:text-xs',
        md: 'mhui:px-4 mhui:py-2 mhui:text-sm',
        lg: 'mhui:px-5 mhui:py-2.5 mhui:text-base',
      },
      selected: {
        true: '',
        false:
          'mhui:text-slate-600 mhui:hover:text-slate-900 mhui:dark:text-slate-400 mhui:dark:hover:text-slate-100',
      },
    },
    compoundVariants: [
      {
        variant: 'underline',
        selected: true,
        className:
          'mhui:border-b-blue-900 mhui:bg-white mhui:text-blue-900 mhui:shadow-xs mhui:dark:border-b-blue-400 mhui:dark:bg-slate-800 mhui:dark:text-blue-400',
      },
      {
        variant: 'solid',
        selected: true,
        className:
          'mhui:bg-blue-900 mhui:text-white mhui:shadow-xs mhui:dark:bg-blue-700 mhui:dark:text-white',
      },
      {
        variant: 'solid',
        selected: false,
        className: 'mhui:hover:bg-slate-200/70 mhui:dark:hover:bg-slate-800',
      },
    ],
    defaultVariants: {
      variant: 'underline',
      size: 'md',
      selected: false,
    },
  },
);

interface TabsContextValue {
  baseId: string;
  activeValue: string | undefined;
  selectValue: (nextValue: string) => void;
  variant: TabsVariant;
  size: TabsSize;
  orientation: TabsOrientation;
  navigateTab: (currentButton: HTMLButtonElement, key: string) => void;
  registerTabList: (node: HTMLDivElement | null) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

const sanitizeIdSegment = (val: string) => val.replace(/[^a-zA-Z0-9_-]/g, '-');

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  /** Controlled active tab value */
  value?: string;
  /** Initial active tab value for uncontrolled usage */
  defaultValue?: string;
  /** Callback invoked when the active tab changes */
  onValueChange?: (value: string) => void;
  /** Visual style of the tab triggers */
  variant?: TabsVariant;
  /** Size scale of the tab triggers */
  size?: TabsSize;
  /** Layout and keyboard navigation axis */
  orientation?: TabsOrientation;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      variant = 'underline',
      size = 'md',
      orientation = 'horizontal',
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const baseId = useId();
    const tabListRef = useRef<HTMLDivElement | null>(null);
    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState<string | undefined>(defaultValue);
    const activeValue = isControlled ? value : uncontrolledValue;

    const registerTabList = useCallback((node: HTMLDivElement | null) => {
      tabListRef.current = node;
    }, []);

    const selectValue = useCallback(
      (nextValue: string) => {
        if (!isControlled) {
          setUncontrolledValue(nextValue);
        }
        onValueChange?.(nextValue);
      },
      [isControlled, onValueChange],
    );

    const navigateTab = useCallback(
      (currentButton: HTMLButtonElement, key: string) => {
        const triggers = Array.from(
          tabListRef.current?.querySelectorAll<HTMLButtonElement>(
            'button[role="tab"]:not(:disabled)',
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

        if (key === 'ArrowRight' || key === 'ArrowDown') {
          nextIndex = (currentIndex + 1) % triggers.length;
        } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
          nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;
        } else if (key === 'Home') {
          nextIndex = 0;
        } else if (key === 'End') {
          nextIndex = triggers.length - 1;
        }

        if (nextIndex !== null) {
          const nextTrigger = triggers[nextIndex];
          nextTrigger?.focus();
          const nextTabValue = nextTrigger?.getAttribute('data-tab-value');
          if (nextTabValue) {
            selectValue(nextTabValue);
          }
        }
      },
      [selectValue],
    );

    return (
      <TabsContext.Provider
        value={{
          baseId,
          activeValue,
          selectValue,
          variant,
          size,
          orientation,
          navigateTab,
          registerTabList,
        }}
      >
        <div
          ref={ref}
          data-orientation={orientation}
          className={cn(
            'mhui:flex mhui:w-full mhui:gap-4',
            orientation === 'vertical' ? 'mhui:flex-row' : 'mhui:flex-col',
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </TabsContext.Provider>
    );
  },
);

Tabs.displayName = 'Tabs';

export type TabListProps = HTMLAttributes<HTMLDivElement>;

export const TabList = forwardRef<HTMLDivElement, TabListProps>(
  ({ className, children, ...props }, forwardedRef) => {
    const context = useContext(TabsContext);
    if (!context) {
      throw new Error('TabList must be used within a Tabs component.');
    }

    const setRefs = (node: HTMLDivElement | null) => {
      context.registerTabList(node);
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    };

    return (
      <div
        ref={setRefs}
        role="tablist"
        aria-orientation={context.orientation}
        className={cn(
          tabListVariants({
            variant: context.variant,
            orientation: context.orientation,
          }),
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

TabList.displayName = 'TabList';

export interface TabTriggerProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<VariantProps<typeof tabTriggerVariants>, 'selected'> {
  /** Unique identifier matching the corresponding `TabContent` */
  value: string;
}

export const TabTrigger = forwardRef<HTMLButtonElement, TabTriggerProps>(
  ({ value, variant, size, disabled, className, onClick, onKeyDown, children, ...props }, ref) => {
    const context = useContext(TabsContext);
    if (!context) {
      throw new Error('TabTrigger must be used within a Tabs component.');
    }

    const isSelected = context.activeValue === value;
    const resolvedVariant = variant ?? context.variant;
    const resolvedSize = size ?? context.size;
    const safeSegment = sanitizeIdSegment(value);
    const triggerId = `${context.baseId}-trigger-${safeSegment}`;
    const panelId = `${context.baseId}-panel-${safeSegment}`;

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      if (!disabled) {
        context.selectValue(value);
      }
      onClick?.(event);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || disabled) {
        return;
      }

      const isHorizontalKey =
        context.orientation === 'horizontal' &&
        (event.key === 'ArrowRight' || event.key === 'ArrowLeft');
      const isVerticalKey =
        context.orientation === 'vertical' &&
        (event.key === 'ArrowDown' || event.key === 'ArrowUp');

      if (isHorizontalKey || isVerticalKey || event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        context.navigateTab(event.currentTarget, event.key);
      }
    };

    return (
      <button
        ref={ref}
        id={triggerId}
        type="button"
        role="tab"
        disabled={disabled}
        aria-selected={isSelected}
        aria-controls={panelId}
        tabIndex={isSelected ? 0 : -1}
        data-state={isSelected ? 'active' : 'inactive'}
        data-tab-value={value}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          tabTriggerVariants({
            variant: resolvedVariant,
            size: resolvedSize,
            selected: isSelected,
          }),
          context.orientation === 'vertical' && 'mhui:justify-start',
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

TabTrigger.displayName = 'TabTrigger';

export interface TabContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Unique identifier matching the corresponding `TabTrigger` */
  value: string;
}

export const TabContent = forwardRef<HTMLDivElement, TabContentProps>(
  ({ value, className, children, ...props }, ref) => {
    const context = useContext(TabsContext);
    if (!context) {
      throw new Error('TabContent must be used within a Tabs component.');
    }

    const isSelected = context.activeValue === value;
    const safeSegment = sanitizeIdSegment(value);
    const triggerId = `${context.baseId}-trigger-${safeSegment}`;
    const panelId = `${context.baseId}-panel-${safeSegment}`;

    return (
      <div
        ref={ref}
        id={panelId}
        role="tabpanel"
        aria-labelledby={triggerId}
        hidden={!isSelected}
        tabIndex={0}
        data-state={isSelected ? 'active' : 'inactive'}
        className={cn(
          'mhui:flex-1 mhui:rounded-none mhui:text-sm mhui:text-slate-700 mhui:dark:text-slate-300',
          'mhui:focus-visible:ring-2 mhui:focus-visible:ring-blue-900 mhui:focus-visible:outline-none mhui:dark:focus-visible:ring-blue-400',
          !isSelected && 'mhui:hidden',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

TabContent.displayName = 'TabContent';
