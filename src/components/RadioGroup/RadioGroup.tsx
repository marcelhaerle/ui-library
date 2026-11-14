'use client';

import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useState,
  type ChangeEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { useFormFieldContext } from '../FormField';

export const radioGroupVariants = cva('mhui:flex', {
  variants: {
    orientation: {
      vertical: 'mhui:flex-col mhui:gap-3',
      horizontal: 'mhui:flex-row mhui:flex-wrap mhui:items-start mhui:gap-6',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
});

export type RadioGroupOrientation = NonNullable<
  VariantProps<typeof radioGroupVariants>['orientation']
>;

export const radioControlVariants = cva(
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
      checked: {
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
        checked: false,
        error: false,
        className:
          'mhui:border-slate-400 mhui:group-hover:border-blue-900 mhui:dark:border-slate-600 mhui:dark:group-hover:border-blue-400',
      },
      {
        checked: true,
        error: false,
        className:
          'mhui:border-blue-900 mhui:bg-slate-50 mhui:dark:border-blue-400 mhui:dark:bg-slate-900',
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
          'mhui:border-red-700 mhui:bg-slate-50 mhui:dark:border-red-400 mhui:dark:bg-slate-900',
      },
    ],
    defaultVariants: {
      size: 'md',
      checked: false,
      error: false,
    },
  },
);

export type RadioSize = NonNullable<VariantProps<typeof radioControlVariants>['size']>;

const indicatorSizeMap: Record<RadioSize, string> = {
  sm: 'mhui:h-2 mhui:w-2',
  md: 'mhui:h-2.5 mhui:w-2.5',
  lg: 'mhui:h-3 mhui:w-3',
};

const labelTextSizeMap: Record<RadioSize, string> = {
  sm: 'mhui:text-xs',
  md: 'mhui:text-sm',
  lg: 'mhui:text-base',
};

const descriptionTextSizeMap: Record<RadioSize, string> = {
  sm: 'mhui:text-xs',
  md: 'mhui:text-xs',
  lg: 'mhui:text-sm',
};

interface RadioGroupContextValue {
  name: string;
  value?: string;
  onValueChange: (value: string) => void;
  disabled: boolean;
  error: boolean;
  required: boolean;
  size?: RadioSize;
}

const RadioGroupContext = createContext<RadioGroupContextValue | undefined>(undefined);

export interface RadioGroupProps
  extends
    Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue'>,
    VariantProps<typeof radioGroupVariants> {
  /** Shared name attribute for all child radio inputs */
  name?: string;
  /** Controlled selected value */
  value?: string;
  /** Initial selected value for uncontrolled usage */
  defaultValue?: string;
  /** Callback invoked when the selected radio changes */
  onValueChange?: (value: string) => void;
  /** Disables all radio buttons in the group */
  disabled?: boolean;
  /** Highlights all radio buttons in the group in an error state */
  error?: boolean;
  /** Marks the radio group selection as required */
  required?: boolean;
  /** Default size applied to child Radio components */
  size?: RadioSize;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      name,
      value,
      defaultValue,
      onValueChange,
      orientation = 'vertical',
      disabled,
      error,
      required,
      size,
      className,
      id,
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
      children,
      ...props
    },
    ref,
  ) => {
    const formField = useFormFieldContext();
    const generatedId = useId();

    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState<string | undefined>(defaultValue);
    const currentValue = isControlled ? value : uncontrolledValue;

    const resolvedName = name ?? `mhui-radiogroup-${generatedId}`;
    const resolvedId = id ?? formField?.id;
    const resolvedDisabled = Boolean(disabled ?? formField?.disabled);
    const resolvedError = Boolean(error ?? formField?.hasError);
    const resolvedRequired = Boolean(required ?? formField?.required);
    const resolvedDescribedBy = ariaDescribedBy ?? formField?.describedBy;
    const resolvedAriaInvalid = ariaInvalid ?? (resolvedError ? true : undefined);

    const handleSelect = (nextValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }
      onValueChange?.(nextValue);
    };

    return (
      <RadioGroupContext.Provider
        value={{
          name: resolvedName,
          value: currentValue,
          onValueChange: handleSelect,
          disabled: resolvedDisabled,
          error: resolvedError,
          required: resolvedRequired,
          size,
        }}
      >
        <div
          ref={ref}
          id={resolvedId}
          role="radiogroup"
          aria-orientation={orientation ?? 'vertical'}
          aria-describedby={resolvedDescribedBy}
          aria-invalid={resolvedAriaInvalid}
          aria-required={resolvedRequired || undefined}
          className={cn(radioGroupVariants({ orientation }), className)}
          {...props}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  },
);

RadioGroup.displayName = 'RadioGroup';

export interface RadioProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'value'
> {
  /** Value submitted/selected when this radio option is chosen */
  value: string;
  /** Primary label rendered beside the radio control */
  label?: ReactNode;
  /** Supporting description rendered below the label */
  description?: ReactNode;
  /** Visual size of the radio control and text */
  size?: RadioSize;
  /** Highlights this radio option in an error state */
  error?: boolean;
  /** Optional className applied to the outer label container */
  wrapperClassName?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      value,
      label,
      description,
      size,
      error,
      disabled,
      required,
      name,
      checked,
      defaultChecked,
      onChange,
      wrapperClassName,
      className,
      id,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const group = useContext(RadioGroupContext);
    const generatedId = useId();

    const isGroupManaged = group !== undefined;
    const isStandaloneControlled = !isGroupManaged && checked !== undefined;
    const [standaloneChecked, setStandaloneChecked] = useState<boolean>(Boolean(defaultChecked));

    const isChecked = isGroupManaged
      ? group.value === value
      : isStandaloneControlled
        ? Boolean(checked)
        : standaloneChecked;

    const resolvedSize: RadioSize = size ?? group?.size ?? 'md';
    const resolvedDisabled = Boolean(disabled ?? group?.disabled);
    const resolvedError = Boolean(error ?? group?.error);
    const resolvedRequired = Boolean(required ?? group?.required);
    const resolvedName = name ?? group?.name;
    const resolvedId = id ?? `mhui-radio-${generatedId}`;
    const descriptionId = `${resolvedId}-description`;

    const describedByParts = [description ? descriptionId : undefined, ariaDescribedBy]
      .filter(Boolean)
      .join(' ');
    const resolvedDescribedBy = describedByParts.length > 0 ? describedByParts : undefined;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (isGroupManaged) {
        group.onValueChange(value);
      } else if (!isStandaloneControlled) {
        setStandaloneChecked(event.target.checked);
      }
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
            ref={ref}
            id={resolvedId}
            type="radio"
            name={resolvedName}
            value={value}
            checked={isGroupManaged || isStandaloneControlled ? isChecked : undefined}
            defaultChecked={!isGroupManaged && !isStandaloneControlled ? defaultChecked : undefined}
            disabled={resolvedDisabled}
            required={resolvedRequired}
            aria-describedby={resolvedDescribedBy}
            data-invalid={resolvedError || undefined}
            onChange={handleChange}
            className="mhui:peer mhui:sr-only"
            {...props}
          />
          <span
            aria-hidden="true"
            className={cn(
              radioControlVariants({
                size: resolvedSize,
                checked: isChecked,
                error: resolvedError,
              }),
              className,
            )}
          >
            {isChecked && (
              <span
                className={cn(
                  'mhui:rounded-none',
                  indicatorSizeMap[resolvedSize],
                  resolvedError
                    ? 'mhui:bg-red-700 mhui:dark:bg-red-400'
                    : 'mhui:bg-blue-900 mhui:dark:bg-blue-400',
                )}
              />
            )}
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

Radio.displayName = 'Radio';
