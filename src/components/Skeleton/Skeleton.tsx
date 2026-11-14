import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

export const skeletonVariants = cva(
  'mhui:block mhui:rounded-none mhui:bg-slate-200 mhui:dark:bg-slate-800',
  {
    variants: {
      animated: {
        true: 'mhui:animate-pulse',
        false: '',
      },
    },
    defaultVariants: {
      animated: true,
    },
  },
);

export interface SkeletonProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof skeletonVariants> {
  /** Width of the skeleton (number in px or CSS length string) */
  width?: string | number;
  /** Height of the skeleton (number in px or CSS length string) */
  height?: string | number;
  /** Whether the skeleton pulses to indicate loading */
  animated?: boolean;
}

const formatDimension = (value?: string | number): string | undefined => {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
};

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ width, height, animated = true, className, style, ...props }, ref) => {
    const resolvedStyle: CSSProperties = {
      width: formatDimension(width),
      height: formatDimension(height),
      ...style,
    };

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          skeletonVariants({
            animated,
          }),
          width === undefined && 'mhui:w-full',
          height === undefined && 'mhui:h-4',
          className,
        )}
        style={resolvedStyle}
        {...props}
      />
    );
  },
);

Skeleton.displayName = 'Skeleton';
