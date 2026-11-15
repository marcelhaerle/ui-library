'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { Search, type LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface CommandPaletteItem {
  /** Unique identifier for the command */
  id: string;
  /** Primary label of the command */
  label: ReactNode;
  /** Optional secondary description */
  description?: ReactNode;
  /** Optional leading Lucide icon */
  icon?: LucideIcon;
  /** Optional keyboard shortcut hint (e.g. `'⌘P'` or `'Ctrl+S'`) */
  shortcut?: string;
  /** Disables selection and skips the item during keyboard navigation */
  disabled?: boolean;
  /** Callback fired when the command is executed */
  onSelect: () => void;
}

export interface CommandPaletteGroup {
  /** Unique identifier for the group */
  id: string;
  /** Group section heading */
  heading: ReactNode;
  /** Command items within the group */
  items: CommandPaletteItem[];
}

export interface CommandPaletteProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether the command palette dialog is open */
  open: boolean;
  /** Callback fired when the open state should change */
  onOpenChange: (open: boolean) => void;
  /** Search input placeholder text (default: `'Search pages or commands...'`) */
  placeholder?: string;
  /** Grouped command definitions */
  groups: CommandPaletteGroup[];
  /** Custom content rendered when search returns no matches */
  emptyState?: ReactNode;
  /** Enables global `Ctrl+K` / `Cmd+K` shortcut to toggle the palette (default: `true`) */
  enableGlobalShortcut?: boolean;
}

const extractText = (node: ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  return '';
};

export const CommandPalette = forwardRef<HTMLDivElement, CommandPaletteProps>(
  (
    {
      className,
      open,
      onOpenChange,
      placeholder = 'Search pages or commands...',
      groups,
      emptyState = 'No matching commands found.',
      enableGlobalShortcut = true,
      'aria-label': ariaLabel = 'Command palette',
      ...props
    },
    ref,
  ) => {
    const [query, setQuery] = useState('');
    const [activeId, setActiveId] = useState<string | null>(null);

    const baseId = useId();
    const listboxId = `${baseId}-listbox`;

    const dialogRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const setMergedDialogRef = useCallback(
      (node: HTMLDivElement | null) => {
        dialogRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    const filteredGroups = useMemo(() => {
      const normalizedQuery = query.trim().toLowerCase();
      if (!normalizedQuery) {
        return groups.filter((group) => group.items.length > 0);
      }

      return groups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => {
            const searchable = [extractText(item.label), extractText(item.description), item.id]
              .join(' ')
              .toLowerCase();
            return searchable.includes(normalizedQuery);
          }),
        }))
        .filter((group) => group.items.length > 0);
    }, [groups, query]);

    const enabledItems = useMemo(
      () => filteredGroups.flatMap((group) => group.items.filter((item) => !item.disabled)),
      [filteredGroups],
    );

    const resolvedActiveId = useMemo(() => {
      if (enabledItems.length === 0) return null;
      if (activeId && enabledItems.some((item) => item.id === activeId)) {
        return activeId;
      }
      return enabledItems[0]?.id ?? null;
    }, [activeId, enabledItems]);

    useEffect(() => {
      if (open) {
        setQuery('');
        setActiveId(null);
        requestAnimationFrame(() => {
          inputRef.current?.focus();
        });
      }
    }, [open]);

    useEffect(() => {
      if (!enableGlobalShortcut) return;

      const handleGlobalKeyDown = (event: KeyboardEvent) => {
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
          event.preventDefault();
          onOpenChange(!open);
        }
      };

      document.addEventListener('keydown', handleGlobalKeyDown);
      return () => {
        document.removeEventListener('keydown', handleGlobalKeyDown);
      };
    }, [enableGlobalShortcut, open, onOpenChange]);

    useEffect(() => {
      if (!open) return;

      const handleOutsideMouseDown = (event: MouseEvent) => {
        if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
          onOpenChange(false);
        }
      };

      const handleEscapeKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          onOpenChange(false);
        }
      };

      document.addEventListener('mousedown', handleOutsideMouseDown);
      document.addEventListener('keydown', handleEscapeKeyDown);

      return () => {
        document.removeEventListener('mousedown', handleOutsideMouseDown);
        document.removeEventListener('keydown', handleEscapeKeyDown);
      };
    }, [open, onOpenChange]);

    const handleSelectItem = useCallback(
      (item: CommandPaletteItem) => {
        if (item.disabled) return;
        item.onSelect();
        onOpenChange(false);
      },
      [onOpenChange],
    );

    const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onOpenChange(false);
        return;
      }

      if (enabledItems.length === 0) {
        return;
      }

      const currentIndex = enabledItems.findIndex((item) => item.id === resolvedActiveId);

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % enabledItems.length;
        setActiveId(enabledItems[nextIndex]?.id ?? null);
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        const prevIndex =
          currentIndex === -1
            ? enabledItems.length - 1
            : (currentIndex - 1 + enabledItems.length) % enabledItems.length;
        setActiveId(enabledItems[prevIndex]?.id ?? null);
        return;
      }

      if (event.key === 'Home') {
        event.preventDefault();
        setActiveId(enabledItems[0]?.id ?? null);
        return;
      }

      if (event.key === 'End') {
        event.preventDefault();
        setActiveId(enabledItems[enabledItems.length - 1]?.id ?? null);
        return;
      }

      if (event.key === 'Enter' && resolvedActiveId) {
        event.preventDefault();
        const activeItem = enabledItems.find((item) => item.id === resolvedActiveId);
        if (activeItem) {
          handleSelectItem(activeItem);
        }
      }
    };

    if (!open || typeof document === 'undefined') {
      return null;
    }

    return createPortal(
      <div className="mhui:fixed mhui:inset-0 mhui:z-50 mhui:flex mhui:items-start mhui:justify-center mhui:bg-slate-950/60 mhui:p-4 mhui:pt-[12vh]">
        <div
          ref={setMergedDialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          className={cn(
            'mhui:w-full mhui:max-w-xl mhui:overflow-hidden mhui:rounded-none',
            'mhui:bg-white mhui:text-slate-900 mhui:shadow-2xl',
            'mhui:dark:bg-slate-900 mhui:dark:text-slate-100',
            className,
          )}
          {...props}
        >
          <div className="mhui:flex mhui:items-center mhui:gap-3 mhui:bg-slate-100 mhui:px-4 mhui:py-3.5 mhui:dark:bg-slate-800/80">
            <Search
              className="mhui:h-5 mhui:w-5 mhui:shrink-0 mhui:text-slate-500 mhui:dark:text-slate-400"
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-expanded={true}
              aria-autocomplete="list"
              aria-controls={listboxId}
              aria-activedescendant={
                resolvedActiveId ? `${baseId}-option-${resolvedActiveId}` : undefined
              }
              aria-label={placeholder}
              placeholder={placeholder}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveId(null);
              }}
              onKeyDown={handleInputKeyDown}
              className={cn(
                'mhui:w-full mhui:bg-transparent mhui:text-sm mhui:font-medium',
                'mhui:text-slate-900 mhui:placeholder:text-slate-500',
                'mhui:dark:text-slate-100 mhui:dark:placeholder:text-slate-400',
                'mhui:focus:outline-none',
              )}
            />
          </div>

          <div
            id={listboxId}
            role="listbox"
            aria-label="Commands"
            className="mhui:flex mhui:max-h-80 mhui:flex-col mhui:gap-3 mhui:overflow-y-auto mhui:p-2"
          >
            {filteredGroups.length === 0 ? (
              <div
                role="option"
                aria-disabled="true"
                aria-selected="false"
                className="mhui:px-4 mhui:py-10 mhui:text-center mhui:text-sm mhui:text-slate-500 mhui:dark:text-slate-400"
              >
                {emptyState}
              </div>
            ) : (
              filteredGroups.map((group) => {
                const groupHeadingId = `${baseId}-group-${group.id}`;

                return (
                  <div
                    key={group.id}
                    role="group"
                    aria-labelledby={groupHeadingId}
                    className="mhui:flex mhui:flex-col mhui:gap-0.5"
                  >
                    <div
                      id={groupHeadingId}
                      role="presentation"
                      className="mhui:px-3 mhui:py-1.5 mhui:text-xs mhui:font-semibold mhui:tracking-wider mhui:text-slate-500 mhui:uppercase mhui:dark:text-slate-400"
                    >
                      {group.heading}
                    </div>

                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = item.id === resolvedActiveId;

                      return (
                        <div
                          key={item.id}
                          id={`${baseId}-option-${item.id}`}
                          role="option"
                          tabIndex={-1}
                          aria-selected={isActive}
                          aria-disabled={item.disabled || undefined}
                          onMouseEnter={() => {
                            if (!item.disabled) {
                              setActiveId(item.id);
                            }
                          }}
                          onClick={() => handleSelectItem(item)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              handleSelectItem(item);
                            }
                          }}
                          className={cn(
                            'mhui:flex mhui:items-center mhui:justify-between mhui:gap-3 mhui:rounded-none mhui:px-3 mhui:py-2.5',
                            'mhui:text-sm mhui:transition-colors mhui:duration-150 mhui:select-none',
                            item.disabled
                              ? 'mhui:pointer-events-none mhui:cursor-not-allowed mhui:opacity-40'
                              : 'mhui:cursor-pointer',
                            isActive
                              ? 'mhui:bg-blue-900 mhui:text-white mhui:dark:bg-blue-800 mhui:dark:text-white'
                              : 'mhui:text-slate-700 mhui:hover:bg-slate-100 mhui:dark:text-slate-200 mhui:dark:hover:bg-slate-800',
                          )}
                        >
                          <div className="mhui:flex mhui:min-w-0 mhui:items-center mhui:gap-3">
                            {Icon && (
                              <Icon
                                className="mhui:h-4 mhui:w-4 mhui:shrink-0"
                                aria-hidden="true"
                              />
                            )}
                            <div className="mhui:flex mhui:min-w-0 mhui:flex-col">
                              <span className="mhui:truncate mhui:font-medium">{item.label}</span>
                              {item.description && (
                                <span
                                  className={cn(
                                    'mhui:truncate mhui:text-xs',
                                    isActive
                                      ? 'mhui:text-blue-100 mhui:dark:text-slate-200'
                                      : 'mhui:text-slate-500 mhui:dark:text-slate-400',
                                  )}
                                >
                                  {item.description}
                                </span>
                              )}
                            </div>
                          </div>

                          {item.shortcut && (
                            <kbd
                              className={cn(
                                'mhui:shrink-0 mhui:rounded-none mhui:px-1.5 mhui:py-0.5 mhui:font-mono mhui:text-xs',
                                isActive
                                  ? 'mhui:bg-white/20 mhui:text-white'
                                  : 'mhui:bg-slate-200 mhui:text-slate-700 mhui:dark:bg-slate-800 mhui:dark:text-slate-300',
                              )}
                            >
                              {item.shortcut}
                            </kbd>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>,
      document.body,
    );
  },
);

CommandPalette.displayName = 'CommandPalette';
