'use client';

import { forwardRef, useEffect, useState, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { User } from 'lucide-react';
import { cn } from '../../utils/cn';

export const avatarVariants = cva(
  [
    'mhui:relative mhui:inline-flex mhui:shrink-0 mhui:items-center mhui:justify-center',
    'mhui:rounded-none mhui:select-none mhui:font-semibold mhui:uppercase',
    'mhui:bg-blue-900 mhui:text-white mhui:dark:bg-blue-800 mhui:dark:text-slate-100',
  ],
  {
    variants: {
      size: {
        xs: 'mhui:h-6 mhui:w-6 mhui:text-[10px]',
        sm: 'mhui:h-8 mhui:w-8 mhui:text-xs',
        md: 'mhui:h-10 mhui:w-10 mhui:text-sm',
        lg: 'mhui:h-12 mhui:w-12 mhui:text-base',
        xl: 'mhui:h-16 mhui:w-16 mhui:text-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const avatarStatusVariants = cva(
  [
    'mhui:absolute mhui:bottom-0 mhui:right-0 mhui:rounded-none',
    'mhui:ring-2 mhui:ring-white mhui:dark:ring-slate-950',
  ],
  {
    variants: {
      status: {
        online: 'mhui:bg-emerald-800 mhui:dark:bg-emerald-500',
        offline: 'mhui:bg-slate-400 mhui:dark:bg-slate-500',
        busy: 'mhui:bg-red-700 mhui:dark:bg-red-500',
        away: 'mhui:bg-amber-500 mhui:dark:bg-amber-400',
      },
      size: {
        xs: 'mhui:h-1.5 mhui:w-1.5',
        sm: 'mhui:h-2 mhui:w-2',
        md: 'mhui:h-2.5 mhui:w-2.5',
        lg: 'mhui:h-3 mhui:w-3',
        xl: 'mhui:h-3.5 mhui:w-3.5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export type AvatarSize = NonNullable<VariantProps<typeof avatarVariants>['size']>;
export type AvatarStatus = NonNullable<VariantProps<typeof avatarStatusVariants>['status']>;

export interface AvatarProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof avatarVariants> {
  /** Image source URL */
  src?: string;
  /** Accessible alternative text for the avatar */
  alt?: string;
  /** Explicit initials displayed when no image is provided or loading fails */
  initials?: string;
  /** Presence status indicator */
  status?: AvatarStatus;
}

const fallbackIconSizeMap: Record<AvatarSize, string> = {
  xs: 'mhui:h-3.5 mhui:w-3.5',
  sm: 'mhui:h-4 mhui:w-4',
  md: 'mhui:h-5 mhui:w-5',
  lg: 'mhui:h-6 mhui:w-6',
  xl: 'mhui:h-8 mhui:w-8',
};

const getInitialsFromAlt = (alt?: string): string => {
  if (!alt) return '';
  const parts = alt.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) {
    return (parts[0]?.slice(0, 2) ?? '').toUpperCase();
  }
  const first = parts[0]?.[0] ?? '';
  const last = parts[parts.length - 1]?.[0] ?? '';
  return `${first}${last}`.toUpperCase();
};

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, src, alt, initials, size = 'md', status, ...props }, ref) => {
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
      setImageError(false);
    }, [src]);

    const resolvedSize: AvatarSize = size ?? 'md';
    const showImage = Boolean(src) && !imageError;
    const displayInitials = (initials?.trim().slice(0, 2) || getInitialsFromAlt(alt)).toUpperCase();
    const accessibleLabel = alt ?? initials ?? 'User avatar';

    return (
      <span ref={ref} className={cn(avatarVariants({ size: resolvedSize }), className)} {...props}>
        {showImage ? (
          <img
            src={src}
            alt={accessibleLabel}
            onError={() => setImageError(true)}
            className="mhui:h-full mhui:w-full mhui:rounded-none mhui:object-cover"
          />
        ) : (
          <span
            role="img"
            aria-label={accessibleLabel}
            className="mhui:inline-flex mhui:items-center mhui:justify-center mhui:leading-none"
          >
            {displayInitials ? (
              displayInitials
            ) : (
              <User
                aria-hidden="true"
                className={cn('mhui:shrink-0', fallbackIconSizeMap[resolvedSize])}
              />
            )}
          </span>
        )}

        {status && (
          <span
            role="status"
            aria-label={`Status: ${status}`}
            data-status={status}
            className={cn(avatarStatusVariants({ status, size: resolvedSize }))}
          />
        )}
      </span>
    );
  },
);

Avatar.displayName = 'Avatar';
