'use client';

import { forwardRef, useMemo, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export const paginationVariants = cva('mhui:inline-flex mhui:items-center', {
  variants: {
    size: {
      sm: 'mhui:gap-1',
      md: 'mhui:gap-1.5',
      lg: 'mhui:gap-2',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const paginationItemVariants = cva(
  [
    'mhui:inline-flex mhui:items-center mhui:justify-center mhui:font-medium mhui:select-none',
    'mhui:rounded-none mhui:transition-colors mhui:duration-150',
    'mhui:focus-visible:outline-none mhui:focus-visible:ring-2 mhui:focus-visible:ring-blue-900 mhui:focus-visible:ring-offset-2',
    'mhui:dark:focus-visible:ring-blue-400 mhui:dark:focus-visible:ring-offset-slate-950',
    'mhui:disabled:pointer-events-none mhui:disabled:opacity-40',
    'mhui:cursor-pointer',
  ],
  {
    variants: {
      size: {
        sm: 'mhui:h-8 mhui:min-w-8 mhui:px-2 mhui:text-xs',
        md: 'mhui:h-10 mhui:min-w-10 mhui:px-3 mhui:text-sm',
        lg: 'mhui:h-12 mhui:min-w-12 mhui:px-4 mhui:text-base',
      },
      active: {
        true: 'mhui:bg-blue-900 mhui:text-white mhui:font-semibold mhui:dark:bg-blue-800 mhui:dark:text-white',
        false:
          'mhui:bg-slate-100/80 mhui:text-slate-700 mhui:hover:bg-slate-200 mhui:hover:text-blue-900 mhui:dark:bg-slate-900 mhui:dark:text-slate-300 mhui:dark:hover:bg-slate-800 mhui:dark:hover:text-white',
      },
    },
    defaultVariants: {
      size: 'md',
      active: false,
    },
  },
);

export type PaginationSize = NonNullable<VariantProps<typeof paginationVariants>['size']>;

export interface PaginationProps
  extends Omit<HTMLAttributes<HTMLElement>, 'onChange'>, VariantProps<typeof paginationVariants> {
  /** Current active page (1-indexed) */
  page: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback fired when a new page is selected */
  onPageChange: (page: number) => void;
  /** Number of sibling pages shown on each side of the current page (default: `1`) */
  siblingCount?: number;
  /** Whether to display first and last page jump buttons (default: `true`) */
  showFirstLast?: boolean;
  /** Disables all pagination buttons */
  disabled?: boolean;
}

type PaginationRangeItem = number | 'ellipsis-left' | 'ellipsis-right';

const createRange = (start: number, end: number): number[] => {
  const length = end - start + 1;
  return Array.from({ length }, (_, index) => start + index);
};

const getPaginationRange = (
  currentPage: number,
  totalPages: number,
  siblingCount: number,
): PaginationRangeItem[] => {
  const totalPageNumbers = siblingCount * 2 + 5;

  if (totalPages <= totalPageNumbers) {
    return createRange(1, totalPages);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = createRange(1, leftItemCount);
    return [...leftRange, 'ellipsis-right', totalPages];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = createRange(totalPages - rightItemCount + 1, totalPages);
    return [1, 'ellipsis-left', ...rightRange];
  }

  const middleRange = createRange(leftSiblingIndex, rightSiblingIndex);
  return [1, 'ellipsis-left', ...middleRange, 'ellipsis-right', totalPages];
};

const iconSizeMap: Record<PaginationSize, string> = {
  sm: 'mhui:h-3.5 mhui:w-3.5',
  md: 'mhui:h-4 mhui:w-4',
  lg: 'mhui:h-5 mhui:w-5',
};

export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      className,
      page,
      totalPages,
      onPageChange,
      siblingCount = 1,
      showFirstLast = true,
      size = 'md',
      disabled = false,
      'aria-label': ariaLabel = 'Pagination',
      ...props
    },
    ref,
  ) => {
    const resolvedSize: PaginationSize = size ?? 'md';
    const safeTotalPages = Math.max(0, totalPages);
    const currentPage = Math.min(Math.max(1, page), Math.max(1, safeTotalPages));

    const paginationRange = useMemo(
      () =>
        safeTotalPages > 0
          ? getPaginationRange(currentPage, safeTotalPages, Math.max(0, siblingCount))
          : [],
      [currentPage, safeTotalPages, siblingCount],
    );

    if (safeTotalPages <= 0) {
      return null;
    }

    const isFirstPage = currentPage <= 1;
    const isLastPage = currentPage >= safeTotalPages;
    const iconClass = iconSizeMap[resolvedSize];

    return (
      <nav
        ref={ref}
        aria-label={ariaLabel}
        className={cn('mhui:inline-block', className)}
        {...props}
      >
        <ul className={cn(paginationVariants({ size: resolvedSize }))}>
          {showFirstLast && (
            <li>
              <button
                type="button"
                aria-label="First page"
                disabled={disabled || isFirstPage}
                onClick={() => onPageChange(1)}
                className={cn(paginationItemVariants({ size: resolvedSize, active: false }))}
              >
                <ChevronsLeft className={iconClass} aria-hidden="true" />
              </button>
            </li>
          )}

          <li>
            <button
              type="button"
              aria-label="Previous page"
              disabled={disabled || isFirstPage}
              onClick={() => onPageChange(currentPage - 1)}
              className={cn(paginationItemVariants({ size: resolvedSize, active: false }))}
            >
              <ChevronLeft className={iconClass} aria-hidden="true" />
            </button>
          </li>

          {paginationRange.map((item) => {
            if (item === 'ellipsis-left' || item === 'ellipsis-right') {
              return (
                <li key={item}>
                  <span
                    aria-hidden="true"
                    className={cn(
                      'mhui:inline-flex mhui:items-center mhui:justify-center mhui:select-none',
                      'mhui:text-slate-400 mhui:dark:text-slate-500',
                      resolvedSize === 'sm' && 'mhui:h-8 mhui:min-w-8',
                      resolvedSize === 'md' && 'mhui:h-10 mhui:min-w-10',
                      resolvedSize === 'lg' && 'mhui:h-12 mhui:min-w-12',
                    )}
                  >
                    <MoreHorizontal className={iconClass} />
                  </span>
                </li>
              );
            }

            const isCurrent = item === currentPage;

            return (
              <li key={item}>
                <button
                  type="button"
                  aria-current={isCurrent ? 'page' : undefined}
                  disabled={disabled}
                  onClick={() => {
                    if (!isCurrent) {
                      onPageChange(item);
                    }
                  }}
                  className={cn(paginationItemVariants({ size: resolvedSize, active: isCurrent }))}
                >
                  {item}
                </button>
              </li>
            );
          })}

          <li>
            <button
              type="button"
              aria-label="Next page"
              disabled={disabled || isLastPage}
              onClick={() => onPageChange(currentPage + 1)}
              className={cn(paginationItemVariants({ size: resolvedSize, active: false }))}
            >
              <ChevronRight className={iconClass} aria-hidden="true" />
            </button>
          </li>

          {showFirstLast && (
            <li>
              <button
                type="button"
                aria-label="Last page"
                disabled={disabled || isLastPage}
                onClick={() => onPageChange(safeTotalPages)}
                className={cn(paginationItemVariants({ size: resolvedSize, active: false }))}
              >
                <ChevronsRight className={iconClass} aria-hidden="true" />
              </button>
            </li>
          )}
        </ul>
      </nav>
    );
  },
);

Pagination.displayName = 'Pagination';
