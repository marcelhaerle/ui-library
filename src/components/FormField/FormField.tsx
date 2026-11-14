'use client';

import {
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useId,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cn } from '../../utils/cn';
import { Label } from '../Label';

export interface FormFieldContextValue {
  id: string;
  describedBy?: string;
  hasError: boolean;
  disabled: boolean;
  required: boolean;
}

const FormFieldContext = createContext<FormFieldContextValue | undefined>(undefined);

export const useFormFieldContext = (): FormFieldContextValue | undefined => {
  return useContext(FormFieldContext);
};

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  /** Label content displayed above the form control */
  label?: ReactNode;
  /** Explicit id of the form control; generated automatically if omitted */
  htmlFor?: string;
  /** Marks the field as required */
  required?: boolean;
  /** Supplemental helper text displayed below the form control */
  helperText?: ReactNode;
  /** Validation error message; sets aria-invalid on the control when truthy */
  errorText?: ReactNode;
  /** Disables the label and child form control */
  disabled?: boolean;
}

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  (
    {
      label,
      htmlFor,
      required = false,
      helperText,
      errorText,
      disabled = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const controlId = htmlFor ?? `mhui-field-${generatedId}`;
    const helperId = `${controlId}-helper`;
    const errorId = `${controlId}-error`;

    const hasError = Boolean(errorText);
    const hasHelper = Boolean(helperText);

    const describedByIds = [hasHelper ? helperId : undefined, hasError ? errorId : undefined]
      .filter(Boolean)
      .join(' ');
    const describedBy = describedByIds.length > 0 ? describedByIds : undefined;

    const contextValue: FormFieldContextValue = {
      id: controlId,
      describedBy,
      hasError,
      disabled,
      required,
    };

    const renderedChildren =
      isValidElement(children) && typeof children.type === 'string'
        ? cloneElement(children as ReactElement<Record<string, unknown>>, {
            id: (children.props as Record<string, unknown>).id ?? controlId,
            'aria-describedby':
              (children.props as Record<string, unknown>)['aria-describedby'] ?? describedBy,
            'aria-invalid':
              (children.props as Record<string, unknown>)['aria-invalid'] ??
              (hasError ? true : undefined),
            disabled: (children.props as Record<string, unknown>).disabled ?? disabled,
            required: (children.props as Record<string, unknown>).required ?? required,
          })
        : children;

    return (
      <FormFieldContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn('mhui:flex mhui:w-full mhui:flex-col mhui:gap-1.5', className)}
          {...props}
        >
          {label && (
            <Label htmlFor={controlId} required={required} disabled={disabled}>
              {label}
            </Label>
          )}
          {renderedChildren}
          {hasHelper && (
            <p
              id={helperId}
              className={cn(
                'mhui:text-xs mhui:text-slate-600 mhui:dark:text-slate-400',
                disabled && 'mhui:opacity-50',
              )}
            >
              {helperText}
            </p>
          )}
          {hasError && (
            <p
              id={errorId}
              role="alert"
              className="mhui:text-xs mhui:font-medium mhui:text-red-700 mhui:dark:text-red-400"
            >
              {errorText}
            </p>
          )}
        </div>
      </FormFieldContext.Provider>
    );
  },
);

FormField.displayName = 'FormField';
