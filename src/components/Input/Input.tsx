'use client';

import { forwardRef, useRef, useState, type ChangeEvent, type InputHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X, type LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useFormFieldContext } from '../FormField';

export const inputVariants = cva(
  [
    'mhui:w-full mhui:rounded-none mhui:border mhui:font-normal',
    'mhui:bg-slate-50 mhui:text-slate-900 mhui:placeholder:text-slate-400',
    'mhui:dark:bg-slate-900 mhui:dark:text-slate-100 mhui:dark:placeholder:text-slate-500',
    'mhui:transition-colors mhui:duration-200 mhui:ease-in-out',
    'mhui:focus-visible:outline-none mhui:focus-visible:ring-2 mhui:focus-visible:ring-offset-0',
    'mhui:disabled:cursor-not-allowed mhui:disabled:opacity-50',
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

export type InputSize = NonNullable<VariantProps<typeof inputVariants>['size']>;
export type InputState = NonNullable<VariantProps<typeof inputVariants>['state']>;

const iconSizeMap: Record<InputSize, number> = {
  sm: 14,
  md: 16,
  lg: 18,
};

const leadingPaddingMap: Record<InputSize, string> = {
  sm: 'mhui:pl-8',
  md: 'mhui:pl-10',
  lg: 'mhui:pl-11',
};

const trailingPaddingMap: Record<InputSize, string> = {
  sm: 'mhui:pr-8',
  md: 'mhui:pr-10',
  lg: 'mhui:pr-11',
};

const bothTrailingPaddingMap: Record<InputSize, string> = {
  sm: 'mhui:pr-14',
  md: 'mhui:pr-16',
  lg: 'mhui:pr-20',
};

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>, VariantProps<typeof inputVariants> {
  /** Optional leading Lucide icon */
  leadingIcon?: LucideIcon;
  /** Optional trailing Lucide icon */
  trailingIcon?: LucideIcon;
  /** Renders a button to clear the input value when non-empty */
  clearable?: boolean;
  /** Callback fired when the clear button is clicked */
  onClear?: () => void;
  /** Accessible label for the clear button */
  clearLabel?: string;
  /** Whether the input expands to 100% of its container width */
  fullWidth?: boolean;
  /** Optional className applied to the outer wrapper element */
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      state,
      leadingIcon: LeadingIcon,
      trailingIcon: TrailingIcon,
      clearable = false,
      onClear,
      clearLabel = 'Clear input',
      fullWidth = true,
      wrapperClassName,
      className,
      id,
      disabled,
      required,
      readOnly,
      value,
      defaultValue,
      onChange,
      type = 'text',
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
      ...props
    },
    forwardedRef,
  ) => {
    const formField = useFormFieldContext();
    const internalRef = useRef<HTMLInputElement | null>(null);

    const isControlled = value !== undefined;
    const [uncontrolledHasValue, setUncontrolledHasValue] = useState<boolean>(() => {
      if (defaultValue !== undefined && defaultValue !== null) {
        return String(defaultValue).length > 0;
      }
      return false;
    });

    const hasValue = isControlled ? String(value).length > 0 : uncontrolledHasValue;

    const resolvedSize: InputSize = size ?? 'md';
    const resolvedState: InputState = state ?? (formField?.hasError ? 'error' : 'default');
    const resolvedId = id ?? formField?.id;
    const resolvedDisabled = disabled ?? formField?.disabled ?? false;
    const resolvedRequired = required ?? formField?.required ?? false;
    const resolvedDescribedBy = ariaDescribedBy ?? formField?.describedBy;
    const resolvedAriaInvalid =
      ariaInvalid ?? (resolvedState === 'error' || formField?.hasError ? true : undefined);

    const iconPixels = iconSizeMap[resolvedSize];
    const showClearButton = Boolean(clearable && hasValue && !resolvedDisabled && !readOnly);
    const hasTrailingSlot = Boolean(TrailingIcon || showClearButton);
    const hasBothTrailing = Boolean(TrailingIcon && showClearButton);

    const setRef = (node: HTMLInputElement | null) => {
      internalRef.current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setUncontrolledHasValue(event.target.value.length > 0);
      }
      onChange?.(event);
    };

    const handleClear = () => {
      if (!isControlled && internalRef.current) {
        internalRef.current.value = '';
        setUncontrolledHasValue(false);
      }
      onClear?.();
      internalRef.current?.focus();
    };

    return (
      <div
        className={cn(
          'mhui:relative mhui:inline-flex mhui:items-center',
          fullWidth ? 'mhui:w-full' : 'mhui:w-auto',
          wrapperClassName,
        )}
      >
        {LeadingIcon && (
          <span className="mhui:pointer-events-none mhui:absolute mhui:left-3 mhui:inline-flex mhui:items-center mhui:text-slate-500 mhui:dark:text-slate-400">
            <LeadingIcon size={iconPixels} aria-hidden="true" />
          </span>
        )}
        <input
          ref={setRef}
          id={resolvedId}
          type={type}
          disabled={resolvedDisabled}
          required={resolvedRequired}
          readOnly={readOnly}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          aria-describedby={resolvedDescribedBy}
          aria-invalid={resolvedAriaInvalid}
          className={cn(
            inputVariants({
              size: resolvedSize,
              state: resolvedState,
            }),
            LeadingIcon && leadingPaddingMap[resolvedSize],
            hasTrailingSlot &&
              (hasBothTrailing
                ? bothTrailingPaddingMap[resolvedSize]
                : trailingPaddingMap[resolvedSize]),
            className,
          )}
          {...props}
        />
        {hasTrailingSlot && (
          <span className="mhui:absolute mhui:right-2.5 mhui:inline-flex mhui:items-center mhui:gap-1.5 mhui:text-slate-500 mhui:dark:text-slate-400">
            {showClearButton && (
              <button
                type="button"
                onClick={handleClear}
                aria-label={clearLabel}
                className="mhui:inline-flex mhui:cursor-pointer mhui:items-center mhui:justify-center mhui:rounded-none mhui:p-0.5 mhui:text-slate-500 mhui:transition-colors mhui:duration-150 mhui:hover:text-slate-900 mhui:focus-visible:ring-1 mhui:focus-visible:ring-blue-900 mhui:focus-visible:outline-none mhui:dark:text-slate-400 mhui:dark:hover:text-slate-100 mhui:dark:focus-visible:ring-blue-400"
              >
                <X size={iconPixels} aria-hidden="true" />
              </button>
            )}
            {TrailingIcon && (
              <TrailingIcon
                size={iconPixels}
                className="mhui:pointer-events-none mhui:shrink-0"
                aria-hidden="true"
              />
            )}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
