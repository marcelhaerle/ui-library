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
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export const dropdownMenuContentVariants = cva(
  [
    'mhui:absolute mhui:top-full mhui:mt-1.5 mhui:z-50 mhui:min-w-48 mhui:p-1.5',
    'mhui:flex mhui:flex-col mhui:gap-0.5',
    'mhui:rounded-none mhui:bg-white mhui:shadow-lg mhui:ring-1 mhui:ring-slate-900/10',
    'mhui:dark:bg-slate-900 mhui:dark:ring-slate-100/15',
    'mhui:focus:outline-none',
  ],
  {
    variants: {
      align: {
        start: 'mhui:left-0',
        center: 'mhui:left-1/2 mhui:-translate-x-1/2',
        end: 'mhui:right-0',
      },
    },
    defaultVariants: {
      align: 'start',
    },
  },
);

export const dropdownMenuItemVariants = cva(
  [
    'mhui:w-full mhui:flex mhui:items-center mhui:gap-2.5 mhui:px-3 mhui:py-2',
    'mhui:text-left mhui:text-sm mhui:font-medium mhui:rounded-none mhui:select-none',
    'mhui:transition-colors mhui:duration-150',
    'mhui:focus:outline-none mhui:cursor-pointer',
    'mhui:disabled:opacity-40 mhui:disabled:pointer-events-none mhui:disabled:cursor-not-allowed',
  ],
  {
    variants: {
      danger: {
        true: [
          'mhui:text-red-700 mhui:hover:bg-red-50 mhui:hover:text-red-800',
          'mhui:focus-visible:bg-red-50 mhui:focus-visible:text-red-800',
          'mhui:dark:text-red-400 mhui:dark:hover:bg-red-950/60 mhui:dark:hover:text-red-300',
          'mhui:dark:focus-visible:bg-red-950/60 mhui:dark:focus-visible:text-red-300',
        ],
        false: [
          'mhui:text-slate-700 mhui:hover:bg-slate-100 mhui:hover:text-blue-900',
          'mhui:focus-visible:bg-slate-100 mhui:focus-visible:text-blue-900',
          'mhui:dark:text-slate-200 mhui:dark:hover:bg-slate-800 mhui:dark:hover:text-white',
          'mhui:dark:focus-visible:bg-slate-800 mhui:dark:focus-visible:text-white',
        ],
      },
      active: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        danger: false,
        active: true,
        className:
          'mhui:bg-slate-100 mhui:text-blue-900 mhui:dark:bg-slate-800 mhui:dark:text-white',
      },
      {
        danger: true,
        active: true,
        className:
          'mhui:bg-red-50 mhui:text-red-800 mhui:dark:bg-red-950/60 mhui:dark:text-red-300',
      },
    ],
    defaultVariants: {
      danger: false,
      active: false,
    },
  },
);

export type DropdownMenuAlign = NonNullable<
  VariantProps<typeof dropdownMenuContentVariants>['align']
>;

export interface DropdownMenuItem {
  /** Unique identifier for the menu item */
  id: string;
  /** Visible label content */
  label: ReactNode;
  /** Optional leading Lucide icon */
  icon?: LucideIcon;
  /** Styles the item with danger/destructive intent */
  danger?: boolean;
  /** Disables selection and skips item in keyboard navigation */
  disabled?: boolean;
  /** Callback fired when the item is selected */
  onSelect: () => void;
}

export interface DropdownMenuProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof dropdownMenuContentVariants> {
  /** Trigger element or label that opens the dropdown menu */
  trigger: ReactNode;
  /** Horizontal alignment of the dropdown menu relative to the trigger (default: `'start'`) */
  align?: DropdownMenuAlign;
  /** Action items rendered inside the menu */
  items: DropdownMenuItem[];
}

interface TriggerElementProps {
  id?: string;
  'aria-haspopup'?: 'menu';
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
  onClick?: (event: ReactMouseEvent<HTMLElement>) => void;
  onKeyDown?: (event: ReactKeyboardEvent<HTMLElement>) => void;
}

export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ className, trigger, align = 'start', items, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number>(-1);

    const baseId = useId();
    const triggerId = `${baseId}-trigger`;
    const menuId = `${baseId}-menu`;

    const containerRef = useRef<HTMLDivElement | null>(null);
    const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const typeaheadBufferRef = useRef('');
    const typeaheadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const setMergedRef = useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    const getEnabledIndices = useCallback(
      () =>
        items.reduce<number[]>((acc, item, index) => {
          if (!item.disabled) {
            acc.push(index);
          }
          return acc;
        }, []),
      [items],
    );

    const focusTrigger = useCallback(() => {
      const triggerEl = containerRef.current?.querySelector<HTMLElement>('[aria-haspopup="menu"]');
      triggerEl?.focus();
    }, []);

    const closeMenu = useCallback(
      (restoreFocus = false) => {
        setIsOpen(false);
        setActiveIndex(-1);
        typeaheadBufferRef.current = '';
        if (restoreFocus) {
          focusTrigger();
        }
      },
      [focusTrigger],
    );

    const openMenu = useCallback(
      (initialTarget: 'first' | 'last' = 'first') => {
        const enabledIndices = getEnabledIndices();
        const nextIndex =
          enabledIndices.length > 0
            ? ((initialTarget === 'first'
                ? enabledIndices[0]
                : enabledIndices[enabledIndices.length - 1]) ?? -1)
            : -1;
        setIsOpen(true);
        setActiveIndex(nextIndex);
      },
      [getEnabledIndices],
    );

    useEffect(() => {
      if (isOpen && activeIndex >= 0) {
        itemRefs.current[activeIndex]?.focus();
      }
    }, [isOpen, activeIndex]);

    useEffect(() => {
      return () => {
        if (typeaheadTimeoutRef.current) {
          clearTimeout(typeaheadTimeoutRef.current);
        }
      };
    }, []);

    useEffect(() => {
      if (!isOpen) return;

      const handleOutsideMouseDown = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          closeMenu(false);
        }
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (!containerRef.current?.contains(document.activeElement)) {
          return;
        }

        const enabledIndices = getEnabledIndices();

        if (event.key === 'Escape') {
          event.preventDefault();
          closeMenu(true);
          return;
        }

        if (event.key === 'Tab') {
          closeMenu(false);
          return;
        }

        if (enabledIndices.length === 0) {
          return;
        }

        if (event.key === 'ArrowDown') {
          event.preventDefault();
          const currentPos = enabledIndices.indexOf(activeIndex);
          const nextPos = currentPos === -1 ? 0 : (currentPos + 1) % enabledIndices.length;
          setActiveIndex(enabledIndices[nextPos] ?? -1);
          return;
        }

        if (event.key === 'ArrowUp') {
          event.preventDefault();
          const currentPos = enabledIndices.indexOf(activeIndex);
          const prevPos =
            currentPos === -1
              ? enabledIndices.length - 1
              : (currentPos - 1 + enabledIndices.length) % enabledIndices.length;
          setActiveIndex(enabledIndices[prevPos] ?? -1);
          return;
        }

        if (event.key === 'Home') {
          event.preventDefault();
          setActiveIndex(enabledIndices[0] ?? -1);
          return;
        }

        if (event.key === 'End') {
          event.preventDefault();
          setActiveIndex(enabledIndices[enabledIndices.length - 1] ?? -1);
          return;
        }

        const isPrintableKey =
          event.key.length === 1 &&
          !event.ctrlKey &&
          !event.metaKey &&
          !event.altKey &&
          (event.key !== ' ' || typeaheadBufferRef.current.length > 0);

        if (isPrintableKey) {
          event.preventDefault();
          const char = event.key.toLowerCase();
          typeaheadBufferRef.current += char;

          if (typeaheadTimeoutRef.current) {
            clearTimeout(typeaheadTimeoutRef.current);
          }
          typeaheadTimeoutRef.current = setTimeout(() => {
            typeaheadBufferRef.current = '';
          }, 500);

          const search = typeaheadBufferRef.current;
          const currentPos = enabledIndices.indexOf(activeIndex);
          const startOffset = search.length === 1 && currentPos !== -1 ? currentPos + 1 : 0;

          for (let i = 0; i < enabledIndices.length; i += 1) {
            const candidateIndex = enabledIndices[(startOffset + i) % enabledIndices.length];
            if (candidateIndex === undefined) continue;
            const itemNode = itemRefs.current[candidateIndex];
            const itemLabel = items[candidateIndex]?.label;
            const text = (itemNode?.textContent ?? (typeof itemLabel === 'string' ? itemLabel : ''))
              .trim()
              .toLowerCase();

            if (text.startsWith(search)) {
              setActiveIndex(candidateIndex);
              break;
            }
          }
        }
      };

      document.addEventListener('mousedown', handleOutsideMouseDown);
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('mousedown', handleOutsideMouseDown);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [isOpen, activeIndex, closeMenu, getEnabledIndices, items]);

    const handleTriggerClick = (
      event: ReactMouseEvent<HTMLElement>,
      originalOnClick?: (event: ReactMouseEvent<HTMLElement>) => void,
    ) => {
      originalOnClick?.(event);
      if (event.defaultPrevented) return;
      if (isOpen) {
        closeMenu(false);
      } else {
        openMenu('first');
      }
    };

    const handleTriggerKeyDown = (
      event: ReactKeyboardEvent<HTMLElement>,
      originalOnKeyDown?: (event: ReactKeyboardEvent<HTMLElement>) => void,
    ) => {
      originalOnKeyDown?.(event);
      if (event.defaultPrevented) return;

      if (!isOpen && (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        openMenu('first');
      } else if (!isOpen && event.key === 'ArrowUp') {
        event.preventDefault();
        openMenu('last');
      }
    };

    const handleItemSelect = (item: DropdownMenuItem) => {
      if (item.disabled) return;
      item.onSelect();
      closeMenu(true);
    };

    const renderTrigger = () => {
      if (isValidElement<TriggerElementProps>(trigger)) {
        const existingProps = trigger.props;
        return cloneElement(trigger as ReactElement<TriggerElementProps>, {
          id: existingProps.id ?? triggerId,
          'aria-haspopup': 'menu',
          'aria-expanded': isOpen,
          'aria-controls': isOpen ? menuId : undefined,
          onClick: (event: ReactMouseEvent<HTMLElement>) =>
            handleTriggerClick(event, existingProps.onClick),
          onKeyDown: (event: ReactKeyboardEvent<HTMLElement>) =>
            handleTriggerKeyDown(event, existingProps.onKeyDown),
        });
      }

      return (
        <button
          id={triggerId}
          type="button"
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-controls={isOpen ? menuId : undefined}
          onClick={(event) => handleTriggerClick(event)}
          onKeyDown={(event) => handleTriggerKeyDown(event)}
          className={cn(
            'mhui:inline-flex mhui:h-10 mhui:items-center mhui:justify-center mhui:px-4 mhui:text-sm mhui:font-medium',
            'mhui:rounded-none mhui:bg-blue-900 mhui:text-white mhui:hover:bg-blue-800',
            'mhui:dark:bg-blue-800 mhui:dark:hover:bg-blue-700',
            'mhui:focus-visible:ring-2 mhui:focus-visible:ring-blue-900 mhui:focus-visible:ring-offset-2 mhui:focus-visible:outline-none',
            'mhui:dark:focus-visible:ring-blue-400 mhui:dark:focus-visible:ring-offset-slate-950',
            'mhui:cursor-pointer',
          )}
        >
          {trigger}
        </button>
      );
    };

    return (
      <div
        ref={setMergedRef}
        className={cn('mhui:relative mhui:inline-block', className)}
        {...props}
      >
        {renderTrigger()}

        {isOpen && (
          <div
            id={menuId}
            role="menu"
            aria-labelledby={triggerId}
            tabIndex={-1}
            className={cn(dropdownMenuContentVariants({ align }))}
          >
            {items.map((item, index) => {
              const Icon = item.icon;
              const isFocused = index === activeIndex;

              return (
                <button
                  key={item.id}
                  ref={(node) => {
                    itemRefs.current[index] = node;
                  }}
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  aria-disabled={item.disabled || undefined}
                  tabIndex={isFocused ? 0 : -1}
                  onMouseEnter={() => {
                    if (!item.disabled) {
                      setActiveIndex(index);
                    }
                  }}
                  onClick={() => handleItemSelect(item)}
                  className={cn(
                    dropdownMenuItemVariants({
                      danger: Boolean(item.danger),
                      active: isFocused,
                    }),
                  )}
                >
                  {Icon && <Icon className="mhui:h-4 mhui:w-4 mhui:shrink-0" aria-hidden="true" />}
                  <span className="mhui:flex-1 mhui:truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  },
);

DropdownMenu.displayName = 'DropdownMenu';
