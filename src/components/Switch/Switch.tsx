'use client';

import {
  forwardRef,
  useId,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { useFormFieldContext } from '../FormField';

export const switchTrackVariants = cva(
  [
    'mhui:inline-flex mhui:shrink-0 mhui:items-center',
    'mhui:rounded-none mhui:border mhui:transition-colors mhui:duration-150 mhui:ease-in-out',
    'mhui:peer-focus-visible:ring-2 mhui:peer-focus-visible:ring-offset-2 mhui:dark:peer-focus-visible:ring-offset-slate-950',
  ],
  {
    variants: {
      size: {
        sm: 'mhui:h-5 mhui:w-9 mhui:p-0.5',
        md: 'mhui:h-6 mhui:w-11 mhui:p-[3px]',
        lg: 'mhui:h-7 mhui:w-13 mhui:p-[3px]',
      },
      checked: {
        true: '',
        false: 'mhui:bg-slate-200 mhui:dark:bg-slate-800',
      },
      error: {
        true: 'mhui:peer-focus-visible:ring-red-700 mhui:dark:peer-focus-visible:ring-red-400',
        false: 'mhui:peer-focus-visible:ring-blue-900 mhui:dark:peer-focus-visible:ring-blue-400',
      },
    },
    compoundVariants: [
      {
        checked: false,
        error: false,
        className:
          'mhui:border-slate-400 mhui:group-hover:border-blue-900 mhui:dark:border-slate-600 mhui:dark:group-hover:border-blue-400',
      },
      {
        checked: true,
        error: false,
        className:
          'mhui:border-blue-900 mhui:bg-blue-900 mhui:dark:border-blue-600 mhui:dark:bg-blue-700',
      },
      {
        checked: false,
        error: true,
        className: 'mhui:border-red-700 mhui:dark:border-red-500',
      },
      {
        checked: true,
        error: true,
        className:
          'mhui:border-red-700 mhui:bg-red-700 mhui:dark:border-red-600 mhui:dark:bg-red-700',
      },
    ],
    defaultVariants: {
      size: 'md',
      checked: false,
      error: false,
    },
  },
);

export const switchThumbVariants = cva(
  [
    'mhui:pointer-events-none mhui:block mhui:rounded-none',
    'mhui:transition-transform mhui:duration-150 mhui:ease-in-out',
  ],
  {
    variants: {
      size: {
        sm: 'mhui:h-3.5 mhui:w-3.5',
        md: 'mhui:h-4 mhui:w-4',
        lg: 'mhui:h-5 mhui:w-5',
      },
      checked: {
        true: 'mhui:bg-white mhui:dark:bg-white',
        false: 'mhui:translate-x-0 mhui:bg-slate-600 mhui:dark:bg-slate-300',
      },
    },
    compoundVariants: [
      {
        size: 'sm',
        checked: true,
        className: 'mhui:translate-x-4',
      },
      {
        size: 'md',
        checked: true,
        className: 'mhui:translate-x-5',
      },
      {
        size: 'lg',
        checked: true,
        className: 'mhui:translate-x-6',
      },
    ],
    defaultVariants: {
      size: 'md',
      checked: false,
    },
  },
);

export type SwitchSize = NonNullable<VariantProps<typeof switchTrackVariants>['size']>;
export type SwitchLabelPosition = 'left' | 'right';

const labelTextSizeMap: Record<SwitchSize, string> = {
  sm: 'mhui:text-xs',
  md: 'mhui:text-sm',
  lg: 'mhui:text-base',
};

const descriptionTextSizeMap: Record<SwitchSize, string> = {
  sm: 'mhui:text-xs',
  md: 'mhui:text-xs',
  lg: 'mhui:text-sm',
};

export interface SwitchProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'role'
> {
  /** Visual size of the switch control and accompanying text */
  size?: SwitchSize;
  /** Controlled checked state */
  checked?: boolean;
  /** Initial checked state for uncontrolled usage */
  defaultChecked?: boolean;
  /** Callback invoked when the checked state changes */
  onCheckedChange?: (checked: boolean) => void;
  /** Primary label rendered beside the switch */
  label?: ReactNode;
  /** Supporting description rendered below the label */
  description?: ReactNode;
  /** Placement of the label relative to the switch control */
  labelPosition?: SwitchLabelPosition;
  /** Highlights the switch in an error state */
  error?: boolean;
  /** Optional className applied to the outer label container */
  wrapperClassName?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      size = 'md',
      checked,
      defaultChecked,
      onCheckedChange,
      label,
      description,
      labelPosition = 'right',
      error,
      wrapperClassName,
      className,
      id,
      disabled,
      required,
      onChange,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const formField = useFormFieldContext();
    const generatedId = useId();

    const isControlled = checked !== undefined;
    const [uncontrolledChecked, setUncontrolledChecked] = useState<boolean>(
      Boolean(defaultChecked),
    );
    const isChecked = isControlled ? Boolean(checked) : uncontrolledChecked;

    const resolvedSize: SwitchSize = size ?? 'md';
    const resolvedError = Boolean(error ?? formField?.hasError);
    const resolvedDisabled = Boolean(disabled ?? formField?.disabled);
    const resolvedRequired = Boolean(required ?? formField?.required);
    const resolvedId = id ?? formField?.id ?? `mhui-switch-${generatedId}`;
    const descriptionId = `${resolvedId}-description`;

    const describedByParts = [
      description ? descriptionId : undefined,
      ariaDescribedBy ?? formField?.describedBy,
    ]
      .filter(Boolean)
      .join(' ');
    const resolvedDescribedBy = describedByParts.length > 0 ? describedByParts : undefined;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const nextChecked = event.target.checked;
      if (!isControlled) {
        setUncontrolledChecked(nextChecked);
      }
      onCheckedChange?.(nextChecked);
      onChange?.(event);
    };

    const labelContent = (label || description) && (
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
    );

    return (
      <label
        htmlFor={resolvedId}
        className={cn(
          'mhui:group mhui:inline-flex mhui:items-start mhui:gap-3 mhui:select-none',
          labelPosition === 'left' && 'mhui:justify-between',
          resolvedDisabled ? 'mhui:cursor-not-allowed mhui:opacity-50' : 'mhui:cursor-pointer',
          wrapperClassName,
        )}
      >
        {labelPosition === 'left' && labelContent}

        <span className="mhui:relative mhui:inline-flex mhui:shrink-0">
          <input
            ref={ref}
            id={resolvedId}
            type="checkbox"
            role="switch"
            checked={isControlled ? checked : undefined}
            defaultChecked={!isControlled ? defaultChecked : undefined}
            disabled={resolvedDisabled}
            required={resolvedRequired}
            aria-checked={isChecked}
            aria-describedby={resolvedDescribedBy}
            data-invalid={resolvedError || undefined}
            onChange={handleChange}
            className="mhui:peer mhui:sr-only"
            {...props}
          />
          <span
            aria-hidden="true"
            className={cn(
              switchTrackVariants({
                size: resolvedSize,
                checked: isChecked,
                error: resolvedError,
              }),
              className,
            )}
          >
            <span
              className={switchThumbVariants({
                size: resolvedSize,
                checked: isChecked,
              })}
            />
          </span>
        </span>

        {labelPosition === 'right' && labelContent}
      </label>
    );
  },
);

Switch.displayName = 'Switch';
