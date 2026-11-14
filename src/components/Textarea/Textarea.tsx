'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type TextareaHTMLAttributes,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { useFormFieldContext } from '../FormField';

export const textareaVariants = cva(
  [
    'mhui:block mhui:w-full mhui:rounded-none mhui:border mhui:font-normal',
    'mhui:bg-slate-50 mhui:text-slate-900 mhui:placeholder:text-slate-400',
    'mhui:dark:bg-slate-900 mhui:dark:text-slate-100 mhui:dark:placeholder:text-slate-500',
    'mhui:transition-colors mhui:duration-200 mhui:ease-in-out',
    'mhui:focus-visible:outline-none mhui:focus-visible:ring-2 mhui:focus-visible:ring-offset-0',
    'mhui:disabled:cursor-not-allowed mhui:disabled:opacity-50',
  ],
  {
    variants: {
      size: {
        sm: 'mhui:min-h-20 mhui:px-3 mhui:py-2 mhui:text-xs mhui:leading-relaxed',
        md: 'mhui:min-h-24 mhui:px-3.5 mhui:py-2.5 mhui:text-sm mhui:leading-relaxed',
        lg: 'mhui:min-h-32 mhui:px-4 mhui:py-3 mhui:text-base mhui:leading-relaxed',
      },
      state: {
        default:
          'mhui:border-slate-300 mhui:focus-visible:border-blue-900 mhui:focus-visible:ring-blue-900/20 mhui:dark:border-slate-700 mhui:dark:focus-visible:border-blue-400 mhui:dark:focus-visible:ring-blue-400/25',
        error:
          'mhui:border-red-700 mhui:focus-visible:border-red-700 mhui:focus-visible:ring-red-700/20 mhui:dark:border-red-500 mhui:dark:focus-visible:border-red-400 mhui:dark:focus-visible:ring-red-400/25',
        success:
          'mhui:border-emerald-800 mhui:focus-visible:border-emerald-800 mhui:focus-visible:ring-emerald-800/20 mhui:dark:border-emerald-500 mhui:dark:focus-visible:border-emerald-400 mhui:dark:focus-visible:ring-emerald-400/25',
      },
      autoResize: {
        true: 'mhui:resize-none mhui:overflow-hidden',
        false: 'mhui:resize-y',
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'default',
      autoResize: false,
    },
  },
);

export type TextareaSize = NonNullable<VariantProps<typeof textareaVariants>['size']>;
export type TextareaState = NonNullable<VariantProps<typeof textareaVariants>['state']>;

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>, VariantProps<typeof textareaVariants> {
  /** Automatically adjusts height to fit multi-line content */
  autoResize?: boolean;
  /** Displays a live character counter below the textarea */
  showCount?: boolean;
  /** Whether the textarea expands to 100% of its container width */
  fullWidth?: boolean;
  /** Optional className applied to the outer wrapper element */
  wrapperClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      size = 'md',
      state,
      autoResize = false,
      showCount = false,
      maxLength,
      fullWidth = true,
      wrapperClassName,
      className,
      id,
      disabled,
      required,
      value,
      defaultValue,
      onChange,
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
      ...props
    },
    forwardedRef,
  ) => {
    const formField = useFormFieldContext();
    const generatedId = useId();
    const internalRef = useRef<HTMLTextAreaElement | null>(null);

    const isControlled = value !== undefined;
    const [uncontrolledLength, setUncontrolledLength] = useState<number>(() => {
      if (defaultValue !== undefined && defaultValue !== null) {
        return String(defaultValue).length;
      }
      return 0;
    });

    const currentLength = isControlled ? String(value).length : uncontrolledLength;

    const resolvedSize: TextareaSize = size ?? 'md';
    const resolvedState: TextareaState = state ?? (formField?.hasError ? 'error' : 'default');
    const resolvedId = id ?? formField?.id ?? `mhui-textarea-${generatedId}`;
    const countId = `${resolvedId}-count`;
    const resolvedDisabled = disabled ?? formField?.disabled ?? false;
    const resolvedRequired = required ?? formField?.required ?? false;
    const resolvedAriaInvalid =
      ariaInvalid ?? (resolvedState === 'error' || formField?.hasError ? true : undefined);

    const describedByParts = [
      ariaDescribedBy ?? formField?.describedBy,
      showCount ? countId : undefined,
    ]
      .filter(Boolean)
      .join(' ');
    const resolvedDescribedBy = describedByParts.length > 0 ? describedByParts : undefined;

    const adjustHeight = useCallback(() => {
      const element = internalRef.current;
      if (!element || !autoResize) return;
      element.style.height = 'auto';
      element.style.height = `${element.scrollHeight}px`;
    }, [autoResize]);

    useEffect(() => {
      adjustHeight();
    }, [adjustHeight, value]);

    const setRef = (node: HTMLTextAreaElement | null) => {
      internalRef.current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    };

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
      if (!isControlled) {
        setUncontrolledLength(event.target.value.length);
      }
      if (autoResize) {
        adjustHeight();
      }
      onChange?.(event);
    };

    return (
      <div
        className={cn(
          'mhui:flex mhui:flex-col mhui:gap-1',
          fullWidth ? 'mhui:w-full' : 'mhui:w-auto',
          wrapperClassName,
        )}
      >
        <textarea
          ref={setRef}
          id={resolvedId}
          disabled={resolvedDisabled}
          required={resolvedRequired}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          aria-describedby={resolvedDescribedBy}
          aria-invalid={resolvedAriaInvalid}
          className={cn(
            textareaVariants({
              size: resolvedSize,
              state: resolvedState,
              autoResize,
            }),
            className,
          )}
          {...props}
        />
        {showCount && (
          <div
            id={countId}
            aria-live="polite"
            className={cn(
              'mhui:self-end mhui:text-xs mhui:tabular-nums',
              maxLength !== undefined && currentLength >= maxLength
                ? 'mhui:font-medium mhui:text-amber-600 mhui:dark:text-amber-400'
                : 'mhui:text-slate-500 mhui:dark:text-slate-400',
              resolvedDisabled && 'mhui:opacity-50',
            )}
          >
            {maxLength !== undefined ? `${currentLength} / ${maxLength}` : `${currentLength}`}
          </div>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
