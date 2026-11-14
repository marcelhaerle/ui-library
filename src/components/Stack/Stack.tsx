import { forwardRef, type HTMLAttributes, type Ref } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

export const stackVariants = cva('mhui:flex', {
  variants: {
    direction: {
      vertical: 'mhui:flex-col',
      horizontal: 'mhui:flex-row',
    },
    gap: {
      none: 'mhui:gap-0',
      xs: 'mhui:gap-1',
      sm: 'mhui:gap-2',
      md: 'mhui:gap-4',
      lg: 'mhui:gap-6',
      xl: 'mhui:gap-8',
      '2xl': 'mhui:gap-12',
    },
    align: {
      start: 'mhui:items-start',
      center: 'mhui:items-center',
      end: 'mhui:items-end',
      stretch: 'mhui:items-stretch',
      baseline: 'mhui:items-baseline',
    },
    justify: {
      start: 'mhui:justify-start',
      center: 'mhui:justify-center',
      end: 'mhui:justify-end',
      between: 'mhui:justify-between',
      around: 'mhui:justify-around',
    },
    wrap: {
      true: 'mhui:flex-wrap',
      false: 'mhui:flex-nowrap',
    },
  },
  defaultVariants: {
    direction: 'vertical',
    gap: 'md',
    align: 'stretch',
    justify: 'start',
    wrap: false,
  },
});

export type StackDirection = NonNullable<VariantProps<typeof stackVariants>['direction']>;
export type StackGap = NonNullable<VariantProps<typeof stackVariants>['gap']>;
export type StackAlign = NonNullable<VariantProps<typeof stackVariants>['align']>;
export type StackJustify = NonNullable<VariantProps<typeof stackVariants>['justify']>;
export type StackElement =
  'div' | 'section' | 'article' | 'nav' | 'header' | 'footer' | 'main' | 'aside';

export interface StackProps
  extends HTMLAttributes<HTMLElement>, VariantProps<typeof stackVariants> {
  /** Semantic HTML container element to render */
  as?: StackElement;
  /** Flex axis direction */
  direction?: StackDirection;
  /** Consistent spacing scale between child items */
  gap?: StackGap;
  /** Cross-axis alignment (`align-items`) */
  align?: StackAlign;
  /** Main-axis distribution (`justify-content`) */
  justify?: StackJustify;
  /** Allows items to wrap onto multiple lines */
  wrap?: boolean;
}

export const Stack = forwardRef<HTMLElement, StackProps>(
  (
    {
      as: Component = 'div',
      direction = 'vertical',
      gap = 'md',
      align = 'stretch',
      justify = 'start',
      wrap = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <Component
        ref={ref as Ref<HTMLDivElement>}
        className={cn(
          stackVariants({
            direction,
            gap,
            align,
            justify,
            wrap,
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

Stack.displayName = 'Stack';
