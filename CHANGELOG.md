# Changelog

All notable changes to `@haerlemarcel/ui-library` are documented in this file.

## [0.1.0] - 2026-11-15

### Initial Release (`v0.1.0`)

First public release of **`@haerlemarcel/ui-library`**, an accessible, modern React 19+ and Next.js (App Router) UI component library built with TypeScript, Tailwind CSS v4 (`mhui:` prefix isolation), and `class-variance-authority`.

### Highlights

- **30 Production-Ready Components**: Spanning core primitives, form controls, layout containers, feedback overlays, navigation & wayfinding, and data display composites.
- **Collision-Free Styling**: All Tailwind CSS v4 utility classes and variant chains are namespaced with the `mhui:` prefix and merged via a custom `tailwind-merge` resolver.
- **Corporate Identity & Dark Mode**: Designed with sharp edges (`mhui:rounded-none`), spacing-first visual hierarchy, Corporate Identity colors (`blue-900` primary, `emerald-800` secondary/success, `slate` neutrals), and full Light & Dark mode support (`mhui:dark:*`).
- **Next.js App Router & React 19 Ready**: Built with explicit `"use client"` boundaries on interactive components, `forwardRef` support, and full native HTML attribute forwarding.
- **WAI-ARIA Accessibility**: Keyboard navigation, focus trapping, roving `tabIndex`, and ARIA semantics verified with `@storybook/addon-a11y` (axe-core) and Vitest.

---

### Included Components

#### Phase 1: Core Primitives & Typography

- **`Button`**: Multi-variant (`primary`, `secondary`, `outline`, `text`, `success`, `warning`, `danger`) and multi-size (`xs`–`xl`) button with directional hover color sweep and `LucideIcon` support.
- **`Typography` (`Heading`, `Text`, `Code`)**: Semantic typographic scale (`h1`–`h6`, `p`, `span`, `div`, `label`, `code`) with tone and weight variants.
- **`Badge`**: Compact status indicator, category tag, and counter with optional removable button.
- **`Spinner` & `Skeleton`**: Accessible loading indicator (`role="status"`) and animated layout placeholder block.

#### Phase 2: Form Controls & Data Entry

- **`FormField` & `Label`**: Context-driven field wrapper that automatically wires `id`, `aria-describedby`, and `aria-invalid` to child form controls.
- **`Input`**: Single-line text input with validation states (`default`, `error`, `success`), leading/trailing icons, and clearable action.
- **`Textarea`**: Multi-line text input with configurable resize behavior and live character counter (`showCount`).
- **`Select`**: Accessible select control with option groups, placeholder support, and custom chevron indicator.
- **`Checkbox`**: Custom-styled checkbox supporting checked, unchecked, and `indeterminate` states with label and description slots.
- **`RadioGroup` & `Radio`**: Accessible `role="radiogroup"` with horizontal and vertical orientations.
- **`Switch`**: Accessible toggle switch (`role="switch"`, `aria-checked`) in `sm`, `md`, and `lg` sizes.

#### Phase 3: Layout & Structure

- **`Card` (`Card`, `CardHeader`, `CardBody`, `CardFooter`)**: Surface container with `elevated`, `outlined`, and `subtle` variants and configurable padding.
- **`Stack` & `Grid`**: Flexbox and CSS Grid layout primitives with responsive column and gap tokens.
- **`Accordion` (`Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`)**: Collapsible sections supporting `single` and `multiple` expansion modes and arrow-key navigation.

#### Phase 4: Feedback & Overlays

- **`Alert`**: Contextual banner (`info`, `success`, `warning`, `danger`) with default icons, title/description slots, and dismissible support.
- **`Modal` (`Modal`, `ModalHeader`, `ModalBody`, `ModalFooter`)**: Focus-trapped portal dialog (`role="dialog"`, `aria-modal="true"`) with `Escape` and backdrop dismissal.
- **`Drawer` (`Drawer`, `DrawerHeader`, `DrawerBody`, `DrawerFooter`)**: Slide-over panel anchored to `left`, `right`, `top`, or `bottom`.
- **`Tooltip`**: Hover- and focus-triggered contextual overlay (`role="tooltip"`) with configurable placement and delay.
- **`Toast` (`Toast`, `Toaster`, `ToastProvider`, `useToast`)**: Non-blocking viewport notifications with auto-dismiss timers and action buttons.

#### Phase 5: Navigation & Wayfinding

- **`Tabs` (`Tabs`, `TabList`, `TabTrigger`, `TabContent`)**: Roving-tabindex tabbed interface (`underline` and `solid` variants, `horizontal` and `vertical` orientations).
- **`Breadcrumbs` (`Breadcrumbs`, `BreadcrumbItem`)**: Hierarchical path navigation (`aria-label="Breadcrumb"`) with custom separators and `maxItems` middle-item collapsing.
- **`Pagination`**: Page navigation controls with dynamic sibling range truncation and first/last page jump buttons.
- **`DropdownMenu`**: Button-triggered action menu (`role="menu"`) with arrow-key navigation, disabled item skipping, and character typeahead.
- **`Navbar` (`Navbar`, `NavbarBrand`, `NavbarContent`, `NavbarItem`, `NavbarToggle`, `NavbarMobileMenu`)**: Responsive top application bar (`surface`, `primary`, and `elevated` variants) with collapsible mobile navigation.
- **`Sidebar` (`Sidebar`, `SidebarHeader`, `SidebarContent`, `SidebarGroup`, `SidebarItem`, `SidebarFooter`, `SidebarToggle`)**: Vertical application navigation rail with section groups, counter badges, and collapsible icon-only mode.
- **`CommandPalette`**: Keyboard-first global command and navigation launcher (`Ctrl+K` / `Cmd+K`, `role="dialog"` + `role="combobox"` search filtering).

#### Phase 6: Data Display & Complex Composites

- **`Avatar`**: User/entity representation with image rendering, automatic initials or icon fallback on error, and presence status badge (`online`, `offline`, `busy`, `away`).
- **`DataTable` (`Table`)**: Generic tabular component (`DataTable<T>`) with column sorting (`aria-sort`), row selection with indeterminate select-all, density presets, and loading/empty states.
- **`ProgressBar`**: Determinate and shuttle-animated indeterminate linear progress indicator (`role="progressbar"`).
- **`EmptyState`**: Placeholder block with icon, heading, description, and call-to-action slot.
