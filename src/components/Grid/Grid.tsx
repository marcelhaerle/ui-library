import { forwardRef, type HTMLAttributes, type Ref } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

export const gridVariants = cva('mhui:grid', {
  variants: {
    columns: {
      1: 'mhui:grid-cols-1',
      2: 'mhui:grid-cols-2',
      3: 'mhui:grid-cols-3',
      4: 'mhui:grid-cols-4',
      6: 'mhui:grid-cols-6',
      12: 'mhui:grid-cols-12',
    },
    gap: {
      none: 'mhui:gap-0',
      xs: 'mhui:gap-1',
      sm: 'mhui:gap-2',
      md: 'mhui:gap-4',
      lg: 'mhui:gap-6',
      xl: 'mhui:gap-8',
    },
    align: {
      start: 'mhui:items-start',
      center: 'mhui:items-center',
      end: 'mhui:items-end',
      stretch: 'mhui:items-stretch',
    },
  },
  defaultVariants: {
    columns: 1,
    gap: 'md',
    align: 'stretch',
  },
});

export type GridColumns = NonNullable<VariantProps<typeof gridVariants>['columns']>;
export type GridGap = NonNullable<VariantProps<typeof gridVariants>['gap']>;
export type GridAlign = NonNullable<VariantProps<typeof gridVariants>['align']>;
export type GridElement = 'div' | 'section' | 'article';

export interface GridProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof gridVariants> {
  /** Semantic HTML container element to render */
  as?: GridElement;
  /** Number of equal-width grid columns (`1 | 2 | 3 | 4 | 6 | 12`) */
  columns?: GridColumns;
  /** Consistent spacing scale between grid cells */
  gap?: GridGap;
  /** Cross-axis alignment of grid items (`align-items`) */
  align?: GridAlign;
}

export const Grid = forwardRef<HTMLElement, GridProps>(
  (
    {
      as: Component = 'div',
      columns = 1,
      gap = 'md',
      align = 'stretch',
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
          gridVariants({
            columns,
            gap,
            align,
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

Grid.displayName = 'Grid';
