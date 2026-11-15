'use client';

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Menu, X, type LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export const navbarVariants = cva('mhui:w-full mhui:rounded-none mhui:transition-colors', {
  variants: {
    variant: {
      surface:
        'mhui:bg-slate-100 mhui:text-slate-900 mhui:dark:bg-slate-900 mhui:dark:text-slate-100',
      primary: 'mhui:bg-blue-900 mhui:text-white mhui:dark:bg-blue-950 mhui:dark:text-slate-100',
      elevated:
        'mhui:bg-white mhui:text-slate-900 mhui:shadow-md mhui:dark:bg-slate-900 mhui:dark:text-slate-100',
    },
    sticky: {
      true: 'mhui:sticky mhui:top-0 mhui:z-40',
      false: 'mhui:relative',
    },
  },
  defaultVariants: {
    variant: 'surface',
    sticky: false,
  },
});

export const navbarContainerVariants = cva(
  'mhui:mx-auto mhui:flex mhui:min-h-16 mhui:flex-wrap mhui:items-center mhui:justify-between mhui:gap-4 mhui:px-4 mhui:py-2',
  {
    variants: {
      maxWidth: {
        sm: 'mhui:max-w-3xl',
        md: 'mhui:max-w-5xl',
        lg: 'mhui:max-w-6xl',
        xl: 'mhui:max-w-7xl',
        full: 'mhui:max-w-full',
      },
    },
    defaultVariants: {
      maxWidth: 'xl',
    },
  },
);

export const navbarContentVariants = cva('mhui:flex mhui:items-center mhui:gap-1.5', {
  variants: {
    align: {
      start: 'mhui:justify-start mhui:mr-auto',
      center: 'mhui:justify-center mhui:mx-auto',
      end: 'mhui:justify-end mhui:ml-auto',
    },
  },
  defaultVariants: {
    align: 'start',
  },
});

export const navbarItemVariants = cva(
  [
    'mhui:inline-flex mhui:items-center mhui:gap-2 mhui:px-3.5 mhui:py-2 mhui:text-sm',
    'mhui:rounded-none mhui:transition-colors mhui:duration-150 mhui:select-none',
    'mhui:focus-visible:outline-none mhui:focus-visible:ring-2 mhui:focus-visible:ring-offset-2',
  ],
  {
    variants: {
      variant: {
        surface:
          'mhui:focus-visible:ring-blue-900 mhui:dark:focus-visible:ring-blue-400 mhui:dark:focus-visible:ring-offset-slate-900',
        elevated:
          'mhui:focus-visible:ring-blue-900 mhui:dark:focus-visible:ring-blue-400 mhui:dark:focus-visible:ring-offset-slate-900',
        primary:
          'mhui:focus-visible:ring-white mhui:focus-visible:ring-offset-blue-900 mhui:dark:focus-visible:ring-blue-300 mhui:dark:focus-visible:ring-offset-blue-950',
      },
      active: {
        true: 'mhui:font-semibold',
        false: 'mhui:font-medium',
      },
      interactive: {
        true: 'mhui:cursor-pointer',
        false: '',
      },
      disabled: {
        true: 'mhui:opacity-40 mhui:pointer-events-none mhui:cursor-not-allowed',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: ['surface', 'elevated'],
        active: true,
        className: 'mhui:bg-blue-900 mhui:text-white mhui:dark:bg-blue-800 mhui:dark:text-white',
      },
      {
        variant: ['surface', 'elevated'],
        active: false,
        interactive: true,
        className:
          'mhui:text-slate-700 mhui:hover:bg-slate-200/80 mhui:hover:text-blue-900 mhui:dark:text-slate-300 mhui:dark:hover:bg-slate-800 mhui:dark:hover:text-white',
      },
      {
        variant: 'primary',
        active: true,
        className:
          'mhui:bg-emerald-800 mhui:text-white mhui:dark:bg-emerald-700 mhui:dark:text-white',
      },
      {
        variant: 'primary',
        active: false,
        interactive: true,
        className:
          'mhui:text-blue-100 mhui:hover:bg-blue-800 mhui:hover:text-white mhui:dark:text-slate-200 mhui:dark:hover:bg-blue-900 mhui:dark:hover:text-white',
      },
    ],
    defaultVariants: {
      variant: 'surface',
      active: false,
      interactive: false,
      disabled: false,
    },
  },
);

export type NavbarVariant = NonNullable<VariantProps<typeof navbarVariants>['variant']>;
export type NavbarMaxWidth = NonNullable<VariantProps<typeof navbarContainerVariants>['maxWidth']>;
export type NavbarContentAlign = NonNullable<VariantProps<typeof navbarContentVariants>['align']>;

interface NavbarContextValue {
  variant: NavbarVariant;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  mobileMenuId: string;
}

const NavbarContext = createContext<NavbarContextValue | null>(null);

const useNavbarContext = (): NavbarContextValue => {
  const ctx = useContext(NavbarContext);
  if (!ctx) {
    return {
      variant: 'surface',
      mobileMenuOpen: false,
      setMobileMenuOpen: () => {},
      mobileMenuId: 'navbar-mobile-menu',
    };
  }
  return ctx;
};

export interface NavbarProps
  extends
    HTMLAttributes<HTMLElement>,
    VariantProps<typeof navbarVariants>,
    VariantProps<typeof navbarContainerVariants> {
  /** Visual surface style of the navbar (default: `'surface'`) */
  variant?: NavbarVariant;
  /** Pins the navbar to the top of the viewport on scroll (default: `false`) */
  sticky?: boolean;
  /** Maximum width of the inner navigation container (default: `'xl'`) */
  maxWidth?: NavbarMaxWidth;
  /** Controlled open state of the mobile navigation menu */
  mobileMenuOpen?: boolean;
  /** Initial open state of the mobile navigation menu when uncontrolled */
  defaultMobileMenuOpen?: boolean;
  /** Callback fired when the mobile navigation menu open state changes */
  onMobileMenuOpenChange?: (open: boolean) => void;
}

export type NavbarBrandProps = HTMLAttributes<HTMLDivElement>;

export interface NavbarContentProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof navbarContentVariants> {
  /** Horizontal alignment of the content group (default: `'start'`) */
  align?: NavbarContentAlign;
}

export interface NavbarItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Destination link URL; renders an anchor tag when provided */
  href?: string;
  /** Marks the navigation item as the current active page (`aria-current="page"`) */
  active?: boolean;
  /** Optional leading Lucide icon */
  icon?: LucideIcon;
  /** Disables interaction on the item */
  disabled?: boolean;
}

export type NavbarToggleProps = ButtonHTMLAttributes<HTMLButtonElement>;

export type NavbarMobileMenuProps = HTMLAttributes<HTMLDivElement>;

export const Navbar = forwardRef<HTMLElement, NavbarProps>(
  (
    {
      className,
      variant = 'surface',
      sticky = false,
      maxWidth = 'xl',
      mobileMenuOpen: controlledOpen,
      defaultMobileMenuOpen = false,
      onMobileMenuOpenChange,
      'aria-label': ariaLabel = 'Main navigation',
      children,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultMobileMenuOpen);
    const isControlled = controlledOpen !== undefined;
    const mobileMenuOpen = isControlled ? controlledOpen : uncontrolledOpen;
    const resolvedVariant: NavbarVariant = variant ?? 'surface';

    const baseId = useId();
    const mobileMenuId = `${baseId}-mobile-menu`;

    const setMobileMenuOpen = useCallback(
      (nextOpen: boolean) => {
        if (!isControlled) {
          setUncontrolledOpen(nextOpen);
        }
        onMobileMenuOpenChange?.(nextOpen);
      },
      [isControlled, onMobileMenuOpenChange],
    );

    useEffect(() => {
      if (!mobileMenuOpen) return;

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setMobileMenuOpen(false);
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [mobileMenuOpen, setMobileMenuOpen]);

    return (
      <NavbarContext.Provider
        value={{
          variant: resolvedVariant,
          mobileMenuOpen,
          setMobileMenuOpen,
          mobileMenuId,
        }}
      >
        <header
          ref={ref}
          className={cn(
            navbarVariants({ variant: resolvedVariant, sticky: Boolean(sticky) }),
            className,
          )}
          {...props}
        >
          <nav aria-label={ariaLabel} className={cn(navbarContainerVariants({ maxWidth }))}>
            {children}
          </nav>
        </header>
      </NavbarContext.Provider>
    );
  },
);

Navbar.displayName = 'Navbar';

export const NavbarBrand = forwardRef<HTMLDivElement, NavbarBrandProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'mhui:inline-flex mhui:shrink-0 mhui:items-center mhui:gap-2.5 mhui:text-base mhui:font-bold mhui:tracking-tight',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);

NavbarBrand.displayName = 'NavbarBrand';

export const NavbarContent = forwardRef<HTMLDivElement, NavbarContentProps>(
  ({ className, align = 'start', children, ...props }, ref) => (
    <div ref={ref} className={cn(navbarContentVariants({ align }), className)} {...props}>
      {children}
    </div>
  ),
);

NavbarContent.displayName = 'NavbarContent';

export const NavbarItem = forwardRef<HTMLElement, NavbarItemProps>(
  (
    { className, href, active = false, icon: Icon, disabled = false, onClick, children, ...props },
    ref,
  ) => {
    const { variant } = useNavbarContext();
    const isLink = Boolean(href);
    const itemClasses = cn(
      navbarItemVariants({
        variant,
        active: Boolean(active),
        interactive: isLink && !disabled,
        disabled: Boolean(disabled),
      }),
      className,
    );

    if (isLink) {
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
          {Icon && <Icon className="mhui:h-4 mhui:w-4 mhui:shrink-0" aria-hidden="true" />}
          <span>{children}</span>
        </a>
      );
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        aria-current={active ? 'page' : undefined}
        aria-disabled={disabled || undefined}
        className={cn(
          'mhui:inline-flex mhui:items-center mhui:gap-2',
          disabled && 'mhui:pointer-events-none mhui:opacity-40',
          className,
        )}
        {...(props as HTMLAttributes<HTMLDivElement>)}
      >
        {Icon && <Icon className="mhui:h-4 mhui:w-4 mhui:shrink-0" aria-hidden="true" />}
        {children}
      </div>
    );
  },
);

NavbarItem.displayName = 'NavbarItem';

export const NavbarToggle = forwardRef<HTMLButtonElement, NavbarToggleProps>(
  ({ className, 'aria-label': ariaLabel, onClick, ...props }, ref) => {
    const { variant, mobileMenuOpen, setMobileMenuOpen, mobileMenuId } = useNavbarContext();

    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={mobileMenuOpen}
        aria-controls={mobileMenuOpen ? mobileMenuId : undefined}
        aria-label={
          ariaLabel ?? (mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu')
        }
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) {
            setMobileMenuOpen(!mobileMenuOpen);
          }
        }}
        className={cn(
          'mhui:inline-flex mhui:h-10 mhui:w-10 mhui:items-center mhui:justify-center mhui:rounded-none',
          'mhui:cursor-pointer mhui:transition-colors mhui:duration-150',
          'mhui:focus-visible:ring-2 mhui:focus-visible:ring-offset-2 mhui:focus-visible:outline-none',
          variant === 'primary'
            ? 'mhui:text-white mhui:hover:bg-blue-800 mhui:focus-visible:ring-white mhui:focus-visible:ring-offset-blue-900'
            : 'mhui:text-slate-700 mhui:hover:bg-slate-200 mhui:focus-visible:ring-blue-900 mhui:dark:text-slate-200 mhui:dark:hover:bg-slate-800 mhui:dark:focus-visible:ring-blue-400',
          className,
        )}
        {...props}
      >
        {mobileMenuOpen ? (
          <X className="mhui:h-5 mhui:w-5" aria-hidden="true" />
        ) : (
          <Menu className="mhui:h-5 mhui:w-5" aria-hidden="true" />
        )}
      </button>
    );
  },
);

NavbarToggle.displayName = 'NavbarToggle';

export const NavbarMobileMenu = forwardRef<HTMLDivElement, NavbarMobileMenuProps>(
  ({ className, children, ...props }, ref) => {
    const { variant, mobileMenuOpen, mobileMenuId } = useNavbarContext();

    if (!mobileMenuOpen) {
      return null;
    }

    return (
      <div
        ref={ref}
        id={mobileMenuId}
        role="region"
        aria-label="Mobile navigation"
        className={cn(
          'mhui:flex mhui:w-full mhui:basis-full mhui:flex-col mhui:gap-1 mhui:pt-2 mhui:pb-3',
          variant === 'primary' ? 'mhui:bg-blue-900 mhui:dark:bg-blue-950' : 'mhui:bg-inherit',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

NavbarMobileMenu.displayName = 'NavbarMobileMenu';
