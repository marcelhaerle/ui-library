import { forwardRef, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const toneClasses = {
  default: 'mhui:text-slate-900 mhui:dark:text-slate-100',
  muted: 'mhui:text-slate-600 mhui:dark:text-slate-400',
  primary: 'mhui:text-blue-900 mhui:dark:text-blue-300',
  success: 'mhui:text-emerald-800 mhui:dark:text-emerald-400',
  warning: 'mhui:text-amber-600 mhui:dark:text-amber-400',
  danger: 'mhui:text-red-700 mhui:dark:text-red-400',
} as const;

const weightClasses = {
  normal: 'mhui:font-normal',
  medium: 'mhui:font-medium',
  semibold: 'mhui:font-semibold',
  bold: 'mhui:font-bold',
} as const;

const alignClasses = {
  left: 'mhui:text-left',
  center: 'mhui:text-center',
  right: 'mhui:text-right',
} as const;

export const headingVariants = cva('mhui:tracking-tight', {
  variants: {
    size: {
      xs: 'mhui:text-xs mhui:leading-tight',
      sm: 'mhui:text-sm mhui:leading-snug',
      md: 'mhui:text-base mhui:leading-snug',
      lg: 'mhui:text-lg mhui:leading-snug',
      xl: 'mhui:text-xl mhui:leading-tight',
      '2xl': 'mhui:text-2xl mhui:leading-tight',
      '3xl': 'mhui:text-3xl mhui:leading-tight',
    },
    weight: weightClasses,
    tone: toneClasses,
    align: alignClasses,
    truncate: {
      true: 'mhui:truncate',
      false: '',
    },
  },
  defaultVariants: {
    weight: 'bold',
    tone: 'default',
    align: 'left',
    truncate: false,
  },
});

export type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type HeadingSize = NonNullable<VariantProps<typeof headingVariants>['size']>;
export type TypographyWeight = NonNullable<VariantProps<typeof headingVariants>['weight']>;
export type TypographyTone = NonNullable<VariantProps<typeof headingVariants>['tone']>;
export type TypographyAlign = NonNullable<VariantProps<typeof headingVariants>['align']>;

const defaultHeadingSizeMap: Record<HeadingTag, HeadingSize> = {
  h1: '3xl',
  h2: '2xl',
  h3: 'xl',
  h4: 'lg',
  h5: 'md',
  h6: 'sm',
};

export interface HeadingProps
  extends HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingVariants> {
  /** Semantic HTML heading element to render */
  as?: HeadingTag;
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      as: Component = 'h2',
      size,
      weight = 'bold',
      tone = 'default',
      align = 'left',
      truncate = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const resolvedSize: HeadingSize = size ?? defaultHeadingSizeMap[Component];

    return (
      <Component
        ref={ref}
        className={cn(
          headingVariants({
            size: resolvedSize,
            weight,
            tone,
            align,
            truncate,
          }),
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Heading.displayName = 'Heading';

export const textVariants = cva('', {
  variants: {
    size: {
      xs: 'mhui:text-xs mhui:leading-normal',
      sm: 'mhui:text-sm mhui:leading-normal',
      md: 'mhui:text-base mhui:leading-relaxed',
      lg: 'mhui:text-lg mhui:leading-relaxed',
      xl: 'mhui:text-xl mhui:leading-relaxed',
    },
    weight: weightClasses,
    tone: toneClasses,
    align: alignClasses,
    truncate: {
      true: 'mhui:truncate',
      false: '',
    },
  },
  defaultVariants: {
    size: 'md',
    weight: 'normal',
    tone: 'default',
    truncate: false,
  },
});

export type TextTag = 'p' | 'span' | 'div' | 'label';
export type TextSize = NonNullable<VariantProps<typeof textVariants>['size']>;

export interface TextProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof textVariants> {
  /** Semantic HTML text element to render */
  as?: TextTag;
  /** Associated form control id when rendered as a label */
  htmlFor?: string;
}

export const Text = forwardRef<HTMLElement, TextProps>(
  (
    {
      as = 'p',
      size = 'md',
      weight = 'normal',
      tone = 'default',
      align,
      truncate = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const classes = cn(
      textVariants({
        size,
        weight,
        tone,
        align,
        truncate,
      }),
      className,
    );

    switch (as) {
      case 'span':
        return (
          <span ref={ref as React.Ref<HTMLSpanElement>} className={classes} {...props}>
            {children}
          </span>
        );
      case 'div':
        return (
          <div ref={ref as React.Ref<HTMLDivElement>} className={classes} {...props}>
            {children}
          </div>
        );
      case 'label':
        return (
          <label ref={ref as React.Ref<HTMLLabelElement>} className={classes} {...props}>
            {children}
          </label>
        );
      case 'p':
      default:
        return (
          <p ref={ref as React.Ref<HTMLParagraphElement>} className={classes} {...props}>
            {children}
          </p>
        );
    }
  },
);

Text.displayName = 'Text';

export const codeVariants = cva('mhui:rounded-none mhui:font-mono', {
  variants: {
    size: {
      xs: 'mhui:text-xs',
      sm: 'mhui:text-sm',
      md: 'mhui:text-base',
      lg: 'mhui:text-lg',
    },
    tone: {
      default:
        'mhui:bg-slate-100 mhui:text-slate-900 mhui:dark:bg-slate-900 mhui:dark:text-slate-100',
      muted:
        'mhui:bg-slate-100 mhui:text-slate-600 mhui:dark:bg-slate-900 mhui:dark:text-slate-400',
      primary:
        'mhui:bg-blue-50 mhui:text-blue-900 mhui:dark:bg-blue-950/70 mhui:dark:text-blue-200',
      success:
        'mhui:bg-emerald-50 mhui:text-emerald-800 mhui:dark:bg-emerald-950/70 mhui:dark:text-emerald-300',
      warning:
        'mhui:bg-amber-50 mhui:text-amber-700 mhui:dark:bg-amber-950/70 mhui:dark:text-amber-300',
      danger: 'mhui:bg-red-50 mhui:text-red-700 mhui:dark:bg-red-950/70 mhui:dark:text-red-300',
    },
    block: {
      true: 'mhui:block mhui:w-full mhui:overflow-x-auto mhui:p-4 mhui:leading-relaxed mhui:whitespace-pre',
      false: 'mhui:inline-block mhui:px-1.5 mhui:py-0.5',
    },
  },
  defaultVariants: {
    size: 'sm',
    tone: 'default',
    block: false,
  },
});

export type CodeSize = NonNullable<VariantProps<typeof codeVariants>['size']>;

export interface CodeProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof codeVariants> {
  /** Render as a multi-line code block */
  block?: boolean;
}

export const Code = forwardRef<HTMLElement, CodeProps>(
  ({ size = 'sm', tone = 'default', block = false, className, children, ...props }, ref) => {
    return (
      <code
        ref={ref}
        className={cn(
          codeVariants({
            size,
            tone,
            block,
          }),
          className,
        )}
        {...props}
      >
        {children}
      </code>
    );
  },
);

Code.displayName = 'Code';
