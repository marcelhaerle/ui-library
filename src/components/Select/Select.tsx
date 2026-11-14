'use client';

import {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check, ChevronDown, Search } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useFormFieldContext } from '../FormField';

export const selectTriggerVariants = cva(
  [
    'mhui:inline-flex mhui:w-full mhui:items-center mhui:justify-between mhui:gap-2',
    'mhui:rounded-none mhui:border mhui:font-normal mhui:text-left mhui:select-none',
    'mhui:bg-slate-50 mhui:text-slate-900',
    'mhui:dark:bg-slate-900 mhui:dark:text-slate-100',
    'mhui:transition-colors mhui:duration-200 mhui:ease-in-out',
    'mhui:focus-visible:outline-none mhui:focus-visible:ring-2 mhui:focus-visible:ring-offset-0',
    'mhui:disabled:cursor-not-allowed mhui:disabled:opacity-50',
    'mhui:cursor-pointer',
  ],
  {
    variants: {
      size: {
        sm: 'mhui:h-8 mhui:px-3 mhui:text-xs',
        md: 'mhui:h-10 mhui:px-3.5 mhui:text-sm',
        lg: 'mhui:h-12 mhui:px-4 mhui:text-base',
      },
      state: {
        default:
          'mhui:border-slate-300 mhui:focus-visible:border-blue-900 mhui:focus-visible:ring-blue-900/20 mhui:dark:border-slate-700 mhui:dark:focus-visible:border-blue-400 mhui:dark:focus-visible:ring-blue-400/25',
        error:
          'mhui:border-red-700 mhui:focus-visible:border-red-700 mhui:focus-visible:ring-red-700/20 mhui:dark:border-red-500 mhui:dark:focus-visible:border-red-400 mhui:dark:focus-visible:ring-red-400/25',
        success:
          'mhui:border-emerald-800 mhui:focus-visible:border-emerald-800 mhui:focus-visible:ring-emerald-800/20 mhui:dark:border-emerald-500 mhui:dark:focus-visible:border-emerald-400 mhui:dark:focus-visible:ring-emerald-400/25',
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'default',
    },
  },
);

export type SelectSize = NonNullable<VariantProps<typeof selectTriggerVariants>['size']>;
export type SelectState = NonNullable<VariantProps<typeof selectTriggerVariants>['state']>;

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

const iconSizeMap: Record<SelectSize, number> = {
  sm: 14,
  md: 16,
  lg: 18,
};

const optionPaddingMap: Record<SelectSize, string> = {
  sm: 'mhui:px-3 mhui:py-1.5 mhui:text-xs',
  md: 'mhui:px-3.5 mhui:py-2 mhui:text-sm',
  lg: 'mhui:px-4 mhui:py-2.5 mhui:text-base',
};

export interface SelectProps
  extends
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'defaultValue' | 'onChange'>,
    VariantProps<typeof selectTriggerVariants> {
  /** Array of selectable options */
  options: SelectOption[];
  /** Controlled selected option value */
  value?: string;
  /** Initial selected value for uncontrolled usage */
  defaultValue?: string;
  /** Callback invoked when the selected value changes */
  onValueChange?: (value: string) => void;
  /** Text displayed when no option is selected */
  placeholder?: string;
  /** Enables a search input inside the dropdown to filter options */
  searchable?: boolean;
  /** Placeholder text for the search input when searchable is true */
  searchPlaceholder?: string;
  /** Message displayed when no options match the search query */
  emptyMessage?: string;
  /** Form field name for native form submission */
  name?: string;
  /** Marks the selection as required */
  required?: boolean;
  /** Whether the select trigger expands to 100% of its container width */
  fullWidth?: boolean;
  /** Optional className applied to the outer container */
  wrapperClassName?: string;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      options,
      value,
      defaultValue,
      onValueChange,
      placeholder = 'Select an option...',
      size = 'md',
      state,
      searchable = false,
      searchPlaceholder = 'Search options...',
      emptyMessage = 'No options found.',
      disabled,
      required,
      name,
      fullWidth = true,
      wrapperClassName,
      className,
      id,
      onKeyDown,
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
      ...props
    },
    forwardedRef,
  ) => {
    const formField = useFormFieldContext();
    const generatedId = useId();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const searchInputRef = useRef<HTMLInputElement | null>(null);

    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState<string>(defaultValue ?? '');
    const selectedValue = isControlled ? value : uncontrolledValue;

    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState<number>(-1);

    const resolvedSize: SelectSize = size ?? 'md';
    const resolvedState: SelectState = state ?? (formField?.hasError ? 'error' : 'default');
    const resolvedId = id ?? formField?.id ?? `mhui-select-${generatedId}`;
    const listboxId = `${resolvedId}-listbox`;
    const resolvedDisabled = disabled ?? formField?.disabled ?? false;
    const resolvedRequired = required ?? formField?.required ?? false;
    const resolvedDescribedBy = ariaDescribedBy ?? formField?.describedBy;
    const resolvedAriaInvalid =
      ariaInvalid ?? (resolvedState === 'error' || formField?.hasError ? true : undefined);

    const iconPixels = iconSizeMap[resolvedSize];

    const selectedOption = useMemo(
      () => options.find((opt) => opt.value === selectedValue),
      [options, selectedValue],
    );

    const filteredOptions = useMemo(() => {
      if (!searchable || !searchQuery.trim()) {
        return options;
      }
      const normalized = searchQuery.trim().toLowerCase();
      return options.filter((opt) => opt.label.toLowerCase().includes(normalized));
    }, [options, searchable, searchQuery]);

    const groupedEntries = useMemo(() => {
      const ungrouped: Array<{ option: SelectOption; flatIndex: number }> = [];
      const groups = new Map<string, Array<{ option: SelectOption; flatIndex: number }>>();

      filteredOptions.forEach((option, flatIndex) => {
        if (option.group) {
          const list = groups.get(option.group) ?? [];
          list.push({ option, flatIndex });
          groups.set(option.group, list);
        } else {
          ungrouped.push({ option, flatIndex });
        }
      });

      return { ungrouped, groups: Array.from(groups.entries()) };
    }, [filteredOptions]);

    const setTriggerRef = (node: HTMLButtonElement | null) => {
      triggerRef.current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    };

    const findInitialActiveIndex = (opts: SelectOption[]): number => {
      const selectedIdx = opts.findIndex((o) => o.value === selectedValue && !o.disabled);
      if (selectedIdx !== -1) return selectedIdx;
      return opts.findIndex((o) => !o.disabled);
    };

    const openMenu = () => {
      if (resolvedDisabled) return;
      setSearchQuery('');
      setActiveIndex(findInitialActiveIndex(options));
      setIsOpen(true);
    };

    const closeMenu = (restoreFocus = false) => {
      setIsOpen(false);
      setSearchQuery('');
      setActiveIndex(-1);
      if (restoreFocus) {
        triggerRef.current?.focus();
      }
    };

    const selectOption = (option: SelectOption) => {
      if (option.disabled) return;
      if (!isControlled) {
        setUncontrolledValue(option.value);
      }
      onValueChange?.(option.value);
      closeMenu(true);
    };

    useEffect(() => {
      if (isOpen && searchable) {
        searchInputRef.current?.focus();
      }
    }, [isOpen, searchable]);

    useEffect(() => {
      if (!isOpen) return;

      const handlePointerDownOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          closeMenu(false);
        }
      };

      document.addEventListener('mousedown', handlePointerDownOutside);
      return () => {
        document.removeEventListener('mousedown', handlePointerDownOutside);
      };
    }, [isOpen]);

    const moveActiveIndex = (direction: 1 | -1) => {
      if (filteredOptions.length === 0) return;
      let nextIdx = activeIndex;
      for (let i = 0; i < filteredOptions.length; i++) {
        nextIdx = (nextIdx + direction + filteredOptions.length) % filteredOptions.length;
        const candidate = filteredOptions[nextIdx];
        if (candidate && !candidate.disabled) {
          setActiveIndex(nextIdx);
          return;
        }
      }
    };

    const handleNavigationKeyDown = (event: KeyboardEvent<HTMLElement>, isSearchInput = false) => {
      if (resolvedDisabled) return;

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          if (!isOpen) {
            openMenu();
          } else {
            moveActiveIndex(1);
          }
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          if (!isOpen) {
            openMenu();
          } else {
            moveActiveIndex(-1);
          }
          break;
        }
        case 'Home': {
          if (isOpen) {
            event.preventDefault();
            const firstEnabled = filteredOptions.findIndex((o) => !o.disabled);
            setActiveIndex(firstEnabled);
          }
          break;
        }
        case 'End': {
          if (isOpen) {
            event.preventDefault();
            for (let i = filteredOptions.length - 1; i >= 0; i--) {
              if (!filteredOptions[i]?.disabled) {
                setActiveIndex(i);
                break;
              }
            }
          }
          break;
        }
        case 'Enter': {
          event.preventDefault();
          if (!isOpen) {
            openMenu();
          } else {
            const activeOption = filteredOptions[activeIndex];
            if (activeOption && !activeOption.disabled) {
              selectOption(activeOption);
            }
          }
          break;
        }
        case ' ': {
          if (!isSearchInput) {
            event.preventDefault();
            if (!isOpen) {
              openMenu();
            } else {
              const activeOption = filteredOptions[activeIndex];
              if (activeOption && !activeOption.disabled) {
                selectOption(activeOption);
              }
            }
          }
          break;
        }
        case 'Escape': {
          if (isOpen) {
            event.preventDefault();
            closeMenu(true);
          }
          break;
        }
        default:
          break;
      }
    };

    const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      handleNavigationKeyDown(event, false);
      onKeyDown?.(event);
    };

    const activeOption = isOpen ? filteredOptions[activeIndex] : undefined;
    const activeOptionId = activeOption ? `${resolvedId}-option-${activeOption.value}` : undefined;

    const renderOptionItem = (option: SelectOption, flatIndex: number) => {
      const isSelected = option.value === selectedValue;
      const isActive = flatIndex === activeIndex;
      const optionId = `${resolvedId}-option-${option.value}`;

      return (
        <div
          key={option.value}
          id={optionId}
          role="option"
          tabIndex={-1}
          aria-selected={isSelected}
          aria-disabled={option.disabled || undefined}
          onMouseEnter={() => {
            if (!option.disabled) {
              setActiveIndex(flatIndex);
            }
          }}
          onClick={() => selectOption(option)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              selectOption(option);
            }
          }}
          className={cn(
            'mhui:flex mhui:items-center mhui:justify-between mhui:gap-2 mhui:select-none',
            optionPaddingMap[resolvedSize],
            option.disabled ? 'mhui:cursor-not-allowed mhui:opacity-40' : 'mhui:cursor-pointer',
            isSelected
              ? 'mhui:bg-blue-900 mhui:font-medium mhui:text-white mhui:dark:bg-blue-800 mhui:dark:text-white'
              : isActive
                ? 'mhui:bg-slate-200 mhui:text-slate-900 mhui:dark:bg-slate-800 mhui:dark:text-slate-100'
                : 'mhui:text-slate-800 mhui:dark:text-slate-200',
          )}
        >
          <span className="mhui:truncate">{option.label}</span>
          {isSelected && <Check size={iconPixels} className="mhui:shrink-0" aria-hidden="true" />}
        </div>
      );
    };

    return (
      <div
        ref={containerRef}
        className={cn(
          'mhui:relative mhui:inline-block',
          fullWidth ? 'mhui:w-full' : 'mhui:w-auto',
          wrapperClassName,
        )}
      >
        {name && (
          <input
            type="hidden"
            name={name}
            value={selectedValue}
            disabled={resolvedDisabled}
            required={resolvedRequired}
          />
        )}
        <button
          ref={setTriggerRef}
          id={resolvedId}
          type="button"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-activedescendant={activeOptionId}
          aria-describedby={resolvedDescribedBy}
          aria-invalid={resolvedAriaInvalid}
          aria-required={resolvedRequired || undefined}
          disabled={resolvedDisabled}
          onClick={() => (isOpen ? closeMenu(true) : openMenu())}
          onKeyDown={handleTriggerKeyDown}
          className={cn(
            selectTriggerVariants({
              size: resolvedSize,
              state: resolvedState,
            }),
            className,
          )}
          {...props}
        >
          <span
            className={cn(
              'mhui:truncate',
              !selectedOption && 'mhui:text-slate-400 mhui:dark:text-slate-500',
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            size={iconPixels}
            aria-hidden="true"
            className={cn(
              'mhui:shrink-0 mhui:text-slate-500 mhui:transition-transform mhui:duration-200 mhui:dark:text-slate-400',
              isOpen && 'mhui:rotate-180',
            )}
          />
        </button>

        {isOpen && (
          <div className="mhui:absolute mhui:left-0 mhui:z-50 mhui:mt-1 mhui:w-full mhui:rounded-none mhui:bg-slate-50 mhui:py-1 mhui:shadow-lg mhui:dark:bg-slate-900">
            {searchable && (
              <div className="mhui:px-2 mhui:pt-1 mhui:pb-1.5">
                <div className="mhui:relative mhui:flex mhui:items-center">
                  <Search
                    size={14}
                    aria-hidden="true"
                    className="mhui:pointer-events-none mhui:absolute mhui:left-2.5 mhui:text-slate-400 mhui:dark:text-slate-500"
                  />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(event) => {
                      const nextQuery = event.target.value;
                      setSearchQuery(nextQuery);
                      const nextFiltered = nextQuery.trim()
                        ? options.filter((o) =>
                            o.label.toLowerCase().includes(nextQuery.trim().toLowerCase()),
                          )
                        : options;
                      setActiveIndex(nextFiltered.findIndex((o) => !o.disabled));
                    }}
                    onKeyDown={(event) => handleNavigationKeyDown(event, true)}
                    placeholder={searchPlaceholder}
                    aria-label={searchPlaceholder}
                    aria-controls={listboxId}
                    aria-activedescendant={activeOptionId}
                    className="mhui:h-8 mhui:w-full mhui:rounded-none mhui:bg-white mhui:pr-2.5 mhui:pl-8 mhui:text-xs mhui:text-slate-900 mhui:placeholder:text-slate-400 mhui:focus-visible:ring-1 mhui:focus-visible:ring-blue-900 mhui:focus-visible:outline-none mhui:dark:bg-slate-950 mhui:dark:text-slate-100 mhui:dark:placeholder:text-slate-500 mhui:dark:focus-visible:ring-blue-400"
                  />
                </div>
              </div>
            )}

            <div
              id={listboxId}
              role="listbox"
              aria-labelledby={resolvedId}
              tabIndex={-1}
              className="mhui:max-h-60 mhui:overflow-y-auto"
            >
              {filteredOptions.length === 0 ? (
                <div className="mhui:px-3.5 mhui:py-3 mhui:text-xs mhui:text-slate-500 mhui:dark:text-slate-400">
                  {emptyMessage}
                </div>
              ) : (
                <>
                  {groupedEntries.ungrouped.map(({ option, flatIndex }) =>
                    renderOptionItem(option, flatIndex),
                  )}
                  {groupedEntries.groups.map(([groupName, groupItems]) => {
                    const groupLabelId = `${resolvedId}-group-${groupName.replace(/\s+/g, '-').toLowerCase()}`;
                    return (
                      <div
                        key={groupName}
                        role="group"
                        aria-labelledby={groupLabelId}
                        className="mhui:mt-1 mhui:first:mt-0"
                      >
                        <div
                          id={groupLabelId}
                          className="mhui:px-3.5 mhui:py-1 mhui:text-xs mhui:font-semibold mhui:tracking-wider mhui:text-slate-500 mhui:uppercase mhui:dark:text-slate-400"
                        >
                          {groupName}
                        </div>
                        {groupItems.map(({ option, flatIndex }) =>
                          renderOptionItem(option, flatIndex),
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
