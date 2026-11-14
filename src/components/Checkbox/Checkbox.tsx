'use client';

import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check, Minus } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useFormFieldContext } from '../FormField';

export const checkboxControlVariants = cva(
  [
    'mhui:inline-flex mhui:shrink-0 mhui:items-center mhui:justify-center',
    'mhui:rounded-none mhui:border mhui:transition-colors mhui:duration-150 mhui:ease-in-out',
    'mhui:peer-focus-visible:ring-2 mhui:peer-focus-visible:ring-offset-2 mhui:dark:peer-focus-visible:ring-offset-slate-950',
  ],
  {
    variants: {
      size: {
        sm: 'mhui:h-4 mhui:w-4',
        md: 'mhui:h-5 mhui:w-5',
        lg: 'mhui:h-6 mhui:w-6',
      },
      active: {
        true: '',
        false: 'mhui:bg-slate-50 mhui:dark:bg-slate-900',
      },
      error: {
        true: 'mhui:peer-focus-visible:ring-red-700 mhui:dark:peer-focus-visible:ring-red-400',
        false: 'mhui:peer-focus-visible:ring-blue-900 mhui:dark:peer-focus-visible:ring-blue-400',
      },
    },
    compoundVariants: [
      {
        active: false,
        error: false,
        className:
          'mhui:border-slate-400 mhui:group-hover:border-blue-900 mhui:dark:border-slate-600 mhui:dark:group-hover:border-blue-400',
      },
      {
        active: true,
        error: false,
        className:
          'mhui:border-blue-900 mhui:bg-blue-900 mhui:text-white mhui:dark:border-blue-600 mhui:dark:bg-blue-700 mhui:dark:text-white',
      },
      {
        active: false,
        error: true,
        className: 'mhui:border-red-700 mhui:dark:border-red-500',
      },
      {
        active: true,
        error: true,
        className:
          'mhui:border-red-700 mhui:bg-red-700 mhui:text-white mhui:dark:border-red-600 mhui:dark:bg-red-700 mhui:dark:text-white',
      },
    ],
    defaultVariants: {
      size: 'md',
      active: false,
      error: false,
    },
  },
);

export type CheckboxSize = NonNullable<VariantProps<typeof checkboxControlVariants>['size']>;

const iconSizeMap: Record<CheckboxSize, number> = {
  sm: 12,
  md: 14,
  lg: 16,
};

const labelTextSizeMap: Record<CheckboxSize, string> = {
  sm: 'mhui:text-xs',
  md: 'mhui:text-sm',
  lg: 'mhui:text-base',
};

const descriptionTextSizeMap: Record<CheckboxSize, string> = {
  sm: 'mhui:text-xs',
  md: 'mhui:text-xs',
  lg: 'mhui:text-sm',
};

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type'
> {
  /** Visual size of the checkbox control and text */
  size?: CheckboxSize;
  /** Controlled checked state */
  checked?: boolean;
  /** Initial checked state for uncontrolled usage */
  defaultChecked?: boolean;
  /** Displays an indeterminate (partially selected) state */
  indeterminate?: boolean;
  /** Callback invoked when the checked state changes */
  onCheckedChange?: (checked: boolean) => void;
  /** Primary label rendered beside the checkbox */
  label?: ReactNode;
  /** Supporting description rendered below the label */
  description?: ReactNode;
  /** Highlights the checkbox in an error state */
  error?: boolean;
  /** Optional className applied to the outer label container */
  wrapperClassName?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      size = 'md',
      checked,
      defaultChecked,
      indeterminate = false,
      onCheckedChange,
      label,
      description,
      error,
      wrapperClassName,
      className,
      id,
      disabled,
      required,
      onChange,
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
      ...props
    },
    forwardedRef,
  ) => {
    const formField = useFormFieldContext();
    const generatedId = useId();
    const internalRef = useRef<HTMLInputElement | null>(null);

    const isControlled = checked !== undefined;
    const [uncontrolledChecked, setUncontrolledChecked] = useState<boolean>(
      Boolean(defaultChecked),
    );
    const isChecked = isControlled ? Boolean(checked) : uncontrolledChecked;

    const resolvedSize: CheckboxSize = size ?? 'md';
    const resolvedError = Boolean(error ?? formField?.hasError);
    const resolvedDisabled = Boolean(disabled ?? formField?.disabled);
    const resolvedRequired = Boolean(required ?? formField?.required);
    const resolvedId = id ?? formField?.id ?? `mhui-checkbox-${generatedId}`;
    const descriptionId = `${resolvedId}-description`;

    const describedByParts = [
      description ? descriptionId : undefined,
      ariaDescribedBy ?? formField?.describedBy,
    ]
      .filter(Boolean)
      .join(' ');
    const resolvedDescribedBy = describedByParts.length > 0 ? describedByParts : undefined;
    const resolvedAriaInvalid = ariaInvalid ?? (resolvedError ? true : undefined);

    const isActive = Boolean(indeterminate || isChecked);
    const iconPixels = iconSizeMap[resolvedSize];

    useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = Boolean(indeterminate);
      }
    }, [indeterminate]);

    const setInputRef = (node: HTMLInputElement | null) => {
      internalRef.current = node;
      if (node) {
        node.indeterminate = Boolean(indeterminate);
      }
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const nextChecked = event.target.checked;
      if (!isControlled) {
        setUncontrolledChecked(nextChecked);
      }
      onCheckedChange?.(nextChecked);
      onChange?.(event);
    };

    return (
      <label
        htmlFor={resolvedId}
        className={cn(
          'mhui:group mhui:inline-flex mhui:items-start mhui:gap-2.5 mhui:select-none',
          resolvedDisabled ? 'mhui:cursor-not-allowed mhui:opacity-50' : 'mhui:cursor-pointer',
          wrapperClassName,
        )}
      >
        <span className="mhui:relative mhui:mt-0.5 mhui:inline-flex mhui:shrink-0">
          <input
            ref={setInputRef}
            id={resolvedId}
            type="checkbox"
            checked={isControlled ? checked : undefined}
            defaultChecked={!isControlled ? defaultChecked : undefined}
            disabled={resolvedDisabled}
            required={resolvedRequired}
            aria-checked={indeterminate ? 'mixed' : isChecked}
            aria-describedby={resolvedDescribedBy}
            aria-invalid={resolvedAriaInvalid}
            onChange={handleChange}
            className="mhui:peer mhui:sr-only"
            {...props}
          />
          <span
            aria-hidden="true"
            className={cn(
              checkboxControlVariants({
                size: resolvedSize,
                active: isActive,
                error: resolvedError,
              }),
              className,
            )}
          >
            {indeterminate ? (
              <Minus size={iconPixels} strokeWidth={2.5} />
            ) : isChecked ? (
              <Check size={iconPixels} strokeWidth={2.5} />
            ) : null}
          </span>
        </span>

        {(label || description) && (
          <span className="mhui:flex mhui:flex-col mhui:gap-0.5">
            {label && (
              <span
                className={cn(
                  'mhui:leading-snug mhui:font-medium',
                  labelTextSizeMap[resolvedSize],
                  resolvedError
                    ? 'mhui:text-red-700 mhui:dark:text-red-400'
                    : 'mhui:text-slate-900 mhui:dark:text-slate-100',
                )}
              >
                {label}
                {resolvedRequired && (
                  <span
                    aria-hidden="true"
                    className="mhui:ml-1 mhui:font-semibold mhui:text-red-700 mhui:dark:text-red-400"
                  >
                    *
                  </span>
                )}
              </span>
            )}
            {description && (
              <span
                id={descriptionId}
                className={cn(
                  'mhui:leading-normal mhui:text-slate-600 mhui:dark:text-slate-400',
                  descriptionTextSizeMap[resolvedSize],
                )}
              >
                {description}
              </span>
            )}
          </span>
        )}
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';
