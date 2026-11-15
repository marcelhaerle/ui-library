'use client';

import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useId,
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { PanelLeftClose, PanelLeftOpen, type LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export const sidebarVariants = cva(
  [
    'mhui:flex mhui:h-full mhui:shrink-0 mhui:flex-col mhui:rounded-none',
    'mhui:bg-slate-100 mhui:text-slate-900 mhui:dark:bg-slate-900 mhui:dark:text-slate-100',
    'mhui:transition-[width] mhui:duration-200 mhui:ease-in-out',
  ],
  {
    variants: {
      width: {
        sm: 'mhui:w-56',
        md: 'mhui:w-64',
        lg: 'mhui:w-72',
      },
      collapsed: {
        true: 'mhui:w-16',
        false: '',
      },
    },
    defaultVariants: {
      width: 'md',
      collapsed: false,
    },
  },
);

export const sidebarItemVariants = cva(
  [
    'mhui:w-full mhui:flex mhui:items-center mhui:gap-3 mhui:px-3 mhui:py-2.5 mhui:text-sm',
    'mhui:rounded-none mhui:transition-colors mhui:duration-150 mhui:select-none mhui:text-left',
    'mhui:focus-visible:outline-none mhui:focus-visible:ring-2 mhui:focus-visible:ring-blue-900 mhui:focus-visible:ring-offset-2',
    'mhui:dark:focus-visible:ring-blue-400 mhui:dark:focus-visible:ring-offset-slate-900',
    'mhui:cursor-pointer',
  ],
  {
    variants: {
      active: {
        true: 'mhui:bg-blue-900 mhui:text-white mhui:font-semibold mhui:dark:bg-blue-800 mhui:dark:text-white',
        false:
          'mhui:font-medium mhui:text-slate-700 mhui:hover:bg-slate-200/80 mhui:hover:text-blue-900 mhui:dark:text-slate-300 mhui:dark:hover:bg-slate-800 mhui:dark:hover:text-white',
      },
      collapsed: {
        true: 'mhui:justify-center mhui:px-0',
        false: '',
      },
      disabled: {
        true: 'mhui:opacity-40 mhui:pointer-events-none mhui:cursor-not-allowed',
        false: '',
      },
    },
    defaultVariants: {
      active: false,
      collapsed: false,
      disabled: false,
    },
  },
);

export type SidebarWidth = NonNullable<VariantProps<typeof sidebarVariants>['width']>;

interface SidebarContextValue {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

const useSidebarContext = (): SidebarContextValue => {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    return {
      collapsed: false,
      setCollapsed: () => {},
    };
  }
  return ctx;
};

export interface SidebarProps
  extends HTMLAttributes<HTMLElement>, Omit<VariantProps<typeof sidebarVariants>, 'collapsed'> {
  /** Controlled collapsed (icon-only rail) state */
  collapsed?: boolean;
  /** Initial collapsed state when uncontrolled (default: `false`) */
  defaultCollapsed?: boolean;
  /** Callback fired when collapsed state changes */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Expanded sidebar width preset (default: `'md'`) */
  width?: SidebarWidth;
}

export type SidebarHeaderProps = HTMLAttributes<HTMLDivElement>;

export type SidebarContentProps = HTMLAttributes<HTMLDivElement>;

export interface SidebarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional section heading for the group */
  label?: ReactNode;
}

export interface SidebarItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Destination link URL; renders an anchor element when provided, or a button otherwise */
  href?: string;
  /** Marks the item as the active page (`aria-current="page"`) */
  active?: boolean;
  /** Optional leading Lucide icon */
  icon?: LucideIcon;
  /** Optional trailing counter or status badge */
  badge?: ReactNode;
  /** Disables interaction on the item */
  disabled?: boolean;
}

export type SidebarFooterProps = HTMLAttributes<HTMLDivElement>;

export type SidebarToggleProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  (
    {
      className,
      width = 'md',
      collapsed: controlledCollapsed,
      defaultCollapsed = false,
      onCollapsedChange,
      'aria-label': ariaLabel = 'Sidebar navigation',
      children,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledCollapsed, setUncontrolledCollapsed] = useState(defaultCollapsed);
    const isControlled = controlledCollapsed !== undefined;
    const collapsed = isControlled ? controlledCollapsed : uncontrolledCollapsed;

    const setCollapsed = useCallback(
      (nextCollapsed: boolean) => {
        if (!isControlled) {
          setUncontrolledCollapsed(nextCollapsed);
        }
        onCollapsedChange?.(nextCollapsed);
      },
      [isControlled, onCollapsedChange],
    );

    return (
      <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
        <aside
          ref={ref}
          data-collapsed={collapsed || undefined}
          className={cn(sidebarVariants({ width, collapsed: Boolean(collapsed) }), className)}
          {...props}
        >
          <nav aria-label={ariaLabel} className="mhui:flex mhui:h-full mhui:w-full mhui:flex-col">
            {children}
          </nav>
        </aside>
      </SidebarContext.Provider>
    );
  },
);

Sidebar.displayName = 'Sidebar';

export const SidebarHeader = forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, children, ...props }, ref) => {
    const { collapsed } = useSidebarContext();
    const childArray = Children.toArray(children);

    const renderedChildren = collapsed
      ? childArray.filter(
          (child) =>
            isValidElement(child) &&
            (child.type === SidebarToggle ||
              (child.type as { displayName?: string })?.displayName === 'SidebarToggle'),
        )
      : childArray;

    return (
      <div
        ref={ref}
        className={cn(
          'mhui:flex mhui:min-h-16 mhui:items-center mhui:justify-between mhui:gap-2 mhui:px-4 mhui:py-3',
          collapsed && 'mhui:justify-center mhui:px-2',
          className,
        )}
        {...props}
      >
        {renderedChildren}
      </div>
    );
  },
);

SidebarHeader.displayName = 'SidebarHeader';

export const SidebarContent = forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'mhui:flex mhui:flex-1 mhui:flex-col mhui:gap-6 mhui:overflow-y-auto mhui:px-2 mhui:py-4',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);

SidebarContent.displayName = 'SidebarContent';

export const SidebarGroup = forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ className, label, children, ...props }, ref) => {
    const { collapsed } = useSidebarContext();
    const labelId = useId();

    return (
      <div
        ref={ref}
        role="group"
        aria-labelledby={label ? labelId : undefined}
        className={cn('mhui:flex mhui:flex-col mhui:gap-1', className)}
        {...props}
      >
        {label && (
          <div
            id={labelId}
            className={cn(
              'mhui:px-3 mhui:pb-1 mhui:text-xs mhui:font-semibold mhui:tracking-wider mhui:uppercase',
              'mhui:text-slate-500 mhui:dark:text-slate-400',
              collapsed && 'mhui:sr-only',
            )}
          >
            {label}
          </div>
        )}
        {children}
      </div>
    );
  },
);

SidebarGroup.displayName = 'SidebarGroup';

export const SidebarItem = forwardRef<HTMLElement, SidebarItemProps>(
  (
    {
      className,
      href,
      active = false,
      icon: Icon,
      badge,
      disabled = false,
      onClick,
      children,
      ...props
    },
    ref,
  ) => {
    const { collapsed } = useSidebarContext();
    const itemClasses = cn(
      sidebarItemVariants({
        active: Boolean(active),
        collapsed: Boolean(collapsed),
        disabled: Boolean(disabled),
      }),
      className,
    );

    const content = (
      <>
        {Icon && <Icon className="mhui:h-4 mhui:w-4 mhui:shrink-0" aria-hidden="true" />}
        <span className={cn('mhui:flex-1 mhui:truncate', collapsed && 'mhui:sr-only')}>
          {children}
        </span>
        {!collapsed && badge !== undefined && badge !== null && (
          <span
            className={cn(
              'mhui:ml-auto mhui:shrink-0 mhui:rounded-none mhui:px-1.5 mhui:py-0.5 mhui:text-xs mhui:font-semibold',
              active
                ? 'mhui:bg-white/20 mhui:text-white'
                : 'mhui:bg-slate-200 mhui:text-slate-700 mhui:dark:bg-slate-800 mhui:dark:text-slate-300',
            )}
          >
            {badge}
          </span>
        )}
      </>
    );

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={disabled ? undefined : href}
          role={disabled ? 'link' : undefined}
          aria-current={active ? 'page' : undefined}
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : undefined}
          onClick={(event) => {
            if (disabled) {
              event.preventDefault();
              return;
            }
            onClick?.(event);
          }}
          className={itemClasses}
          {...props}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        disabled={disabled}
        aria-current={active ? 'page' : undefined}
        onClick={onClick as unknown as ButtonHTMLAttributes<HTMLButtonElement>['onClick']}
        className={itemClasses}
        {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  },
);

SidebarItem.displayName = 'SidebarItem';

export const SidebarFooter = forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, children, ...props }, ref) => {
    const { collapsed } = useSidebarContext();
    return (
      <div
        ref={ref}
        className={cn(
          'mhui:mt-auto mhui:flex mhui:items-center mhui:justify-between mhui:gap-2 mhui:p-3',
          collapsed && 'mhui:justify-center mhui:px-2',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

SidebarFooter.displayName = 'SidebarFooter';

export const SidebarToggle = forwardRef<HTMLButtonElement, SidebarToggleProps>(
  ({ className, 'aria-label': ariaLabel, onClick, ...props }, ref) => {
    const { collapsed, setCollapsed } = useSidebarContext();

    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={!collapsed}
        aria-label={ariaLabel ?? (collapsed ? 'Expand sidebar' : 'Collapse sidebar')}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) {
            setCollapsed(!collapsed);
          }
        }}
        className={cn(
          'mhui:inline-flex mhui:h-8 mhui:w-8 mhui:shrink-0 mhui:items-center mhui:justify-center mhui:rounded-none',
          'mhui:text-slate-600 mhui:hover:bg-slate-200 mhui:hover:text-blue-900',
          'mhui:dark:text-slate-300 mhui:dark:hover:bg-slate-800 mhui:dark:hover:text-white',
          'mhui:cursor-pointer mhui:transition-colors mhui:duration-150',
          'mhui:focus-visible:ring-2 mhui:focus-visible:ring-blue-900 mhui:focus-visible:ring-offset-2 mhui:focus-visible:outline-none',
          'mhui:dark:focus-visible:ring-blue-400 mhui:dark:focus-visible:ring-offset-slate-900',
          className,
        )}
        {...props}
      >
        {collapsed ? (
          <PanelLeftOpen className="mhui:h-4 mhui:w-4" aria-hidden="true" />
        ) : (
          <PanelLeftClose className="mhui:h-4 mhui:w-4" aria-hidden="true" />
        )}
      </button>
    );
  },
);

SidebarToggle.displayName = 'SidebarToggle';
