# `@marcelhaerle/ui-library` Component Roadmap

This roadmap outlines the phased development of `@marcelhaerle/ui-library`. All components strictly follow the architectural and design standards in [AGENTS.md](./AGENTS.md):

- **Design Language**: Hard edges (`mhui:rounded-none`), spacing-driven separation instead of heavy borders, Corporate Identity colors (`blue-900` primary, `emerald-800` success/accent, `slate` neutrals), and full Light & Dark mode support (`mhui:dark:*`).
- **Engineering Standards**: Named exports, arrow-function components, `forwardRef` + native HTML attribute forwarding (`...props`), `"use client"` directives for interactive components, and `mhui:`-prefixed Tailwind CSS v4 utilities.

---

## Phase 1: Core Primitives & Typography

Foundational building blocks required across almost every view and composite component.

### 1. `Button` ✅ _(Completed)_

Interactive trigger for actions and form submissions with directional hover color sweep.

- **Key Props**:
  - `variant`: `'primary' | 'secondary' | 'outline' | 'text' | 'success' | 'warning' | 'danger'` (default: `'primary'`)
  - `size`: `'xs' | 'sm' | 'md' | 'lg' | 'xl'` (default: `'md'`)
  - `icon`: `LucideIcon`
  - `iconPosition`: `'left' | 'right'` (default: `'left'`)
  - `iconOnly`: `boolean` (default: `false`)
  - `loading` _(planned enhancement)_: `boolean` — disables interaction and renders a spinner icon
  - `fullWidth` _(planned enhancement)_: `boolean`
  - Native: `React.ButtonHTMLAttributes<HTMLButtonElement>`

### 2. `Typography` (`Heading`, `Text`, `Code`)

Consistent typographic scale and semantic text rendering for Light and Dark modes.

- **`Heading` Props**:
  - `as`: `'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'` (default: `'h2'`)
  - `size`: `'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'`
  - `weight`: `'normal' | 'medium' | 'semibold' | 'bold'`
  - `tone`: `'default' | 'muted' | 'primary' | 'success' | 'warning' | 'danger'`
  - `align`: `'left' | 'center' | 'right'`
- **`Text` Props**:
  - `as`: `'p' | 'span' | 'div' | 'label'` (default: `'p'`)
  - `size`: `'xs' | 'sm' | 'md' | 'lg' | 'xl'`
  - `weight`: `'normal' | 'medium' | 'semibold' | 'bold'`
  - `tone`: `'default' | 'muted' | 'primary' | 'success' | 'warning' | 'danger'`
  - `truncate`: `boolean`

### 3. `Badge`

Compact status descriptor, category tag, or counter.

- **Key Props**:
  - `variant`: `'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger'`
  - `size`: `'sm' | 'md' | 'lg'`
  - `icon`: `LucideIcon`
  - `removable`: `boolean`
  - `onRemove`: `() => void`
  - Native: `React.HTMLAttributes<HTMLSpanElement>`

### 4. `Spinner` / `Skeleton`

Visual placeholders for asynchronous loading states.

- **`Spinner` Props**:
  - `size`: `'xs' | 'sm' | 'md' | 'lg' | 'xl'`
  - `variant`: `'primary' | 'secondary' | 'current'`
  - `label`: `string` (accessible screen-reader text, default: `'Loading...'`)
- **`Skeleton` Props**:
  - `width`: `string | number`
  - `height`: `string | number`
  - `animated`: `boolean` (default: `true`)

---

## Phase 2: Form Controls & Data Entry

Accessible, composable form inputs with built-in label, helper text, and validation state support.

### 5. `FormField` & `Label`

Wrapper that wires `id`, `aria-describedby`, and `aria-invalid` automatically to child form controls.

- **Key Props**:
  - `label`: `ReactNode`
  - `htmlFor`: `string`
  - `required`: `boolean`
  - `helperText`: `ReactNode`
  - `errorText`: `ReactNode`
  - `disabled`: `boolean`

### 6. `Input`

Single-line text input with optional leading/trailing icons or actions.

- **Key Props**:
  - `size`: `'sm' | 'md' | 'lg'` (default: `'md'`)
  - `state`: `'default' | 'error' | 'success'`
  - `leadingIcon`: `LucideIcon`
  - `trailingIcon`: `LucideIcon`
  - `clearable`: `boolean`
  - `onClear`: `() => void`
  - `fullWidth`: `boolean` (default: `true`)
  - Native: `Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>`

### 7. `Textarea`

Multi-line text input with optional auto-resize and character count.

- **Key Props**:
  - `size`: `'sm' | 'md' | 'lg'`
  - `state`: `'default' | 'error' | 'success'`
  - `autoResize`: `boolean` (default: `false`)
  - `showCount`: `boolean`
  - `maxLength`: `number`
  - Native: `React.TextareaHTMLAttributes<HTMLTextAreaElement>`

### 8. `Select`

Accessible single or multi-option dropdown selector.

- **Key Props**:
  - `options`: `Array<{ value: string; label: string; disabled?: boolean; group?: string }>`
  - `value` / `defaultValue`: `string`
  - `onValueChange`: `(value: string) => void`
  - `placeholder`: `string`
  - `size`: `'sm' | 'md' | 'lg'`
  - `state`: `'default' | 'error' | 'success'`
  - `searchable`: `boolean`
  - `disabled`: `boolean`

### 9. `Checkbox`

Binary or indeterminate selection control.

- **Key Props**:
  - `checked` / `defaultChecked`: `boolean`
  - `indeterminate`: `boolean`
  - `onCheckedChange`: `(checked: boolean) => void`
  - `label`: `ReactNode`
  - `description`: `ReactNode`
  - `size`: `'sm' | 'md' | 'lg'`
  - `error`: `boolean`
  - Native: `Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>`

### 10. `RadioGroup` & `Radio`

Mutually exclusive selection from a set of options.

- **`RadioGroup` Props**:
  - `name`: `string`
  - `value` / `defaultValue`: `string`
  - `onValueChange`: `(value: string) => void`
  - `orientation`: `'vertical' | 'horizontal'` (default: `'vertical'`)
  - `disabled`: `boolean`
  - `error`: `boolean`
- **`Radio` Props**:
  - `value`: `string`
  - `label`: `ReactNode`
  - `description`: `ReactNode`
  - `size`: `'sm' | 'md' | 'lg'`

### 11. `Switch`

Immediate binary toggle control (`role="switch"`).

- **Key Props**:
  - `checked` / `defaultChecked`: `boolean`
  - `onCheckedChange`: `(checked: boolean) => void`
  - `size`: `'sm' | 'md' | 'lg'`
  - `label`: `ReactNode`
  - `labelPosition`: `'left' | 'right'` (default: `'right'`)
  - `disabled`: `boolean`

---

## Phase 3: Layout & Surface Containers

Structural components that organize content using spacing and subtle surface contrast rather than borders.

### 12. `Card` (`Card`, `CardHeader`, `CardBody`, `CardFooter`)

Surface container using background elevation and generous internal spacing.

- **`Card` Props**:
  - `variant`: `'elevated' | 'filled' | 'subtle'` (default: `'elevated'`)
  - `padding`: `'none' | 'sm' | 'md' | 'lg'` (default: `'md'`)
  - `interactive`: `boolean` (applies subtle hover transition when clickable)
  - `as`: `'div' | 'article' | 'section'`

### 13. `Stack` & `Grid`

Layout primitives for consistent vertical/horizontal spacing without manual margin utilities.

- **`Stack` Props**:
  - `direction`: `'vertical' | 'horizontal'` (default: `'vertical'`)
  - `gap`: `'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'`
  - `align`: `'start' | 'center' | 'end' | 'stretch' | 'baseline'`
  - `justify`: `'start' | 'center' | 'end' | 'between' | 'around'`
  - `wrap`: `boolean`
- **`Grid` Props**:
  - `columns`: `1 | 2 | 3 | 4 | 6 | 12`
  - `gap`: `'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'`

### 14. `Accordion` (`Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`)

Vertically stacked collapsible sections with WAI-ARIA disclosure keyboard navigation.

- **Key Props**:
  - `type`: `'single' | 'multiple'` (default: `'single'`)
  - `value` / `defaultValue`: `string | string[]`
  - `onValueChange`: `(value: string | string[]) => void`
  - `collapsible`: `boolean` (default: `true`)

---

## Phase 4: Feedback, Alerts & Overlays

Components that communicate system status, contextual information, or require focused user interaction.

### 15. `Alert`

Inline contextual feedback banner (`role="alert"` or `role="status"`).

- **Key Props**:
  - `variant`: `'info' | 'success' | 'warning' | 'danger'` (default: `'info'`)
  - `title`: `ReactNode`
  - `icon`: `LucideIcon | boolean` (defaults to variant-appropriate Lucide icon)
  - `dismissible`: `boolean`
  - `onDismiss`: `() => void`
  - `action`: `ReactNode`

### 16. `Modal` / `Dialog` (`Modal`, `ModalHeader`, `ModalBody`, `ModalFooter`)

Accessible dialog overlay (`role="dialog"`, `aria-modal="true"`) with focus trapping, `Escape` key dismissal, and scroll locking.

- **Key Props**:
  - `open`: `boolean`
  - `onOpenChange`: `(open: boolean) => void`
  - `size`: `'sm' | 'md' | 'lg' | 'xl' | 'full'` (default: `'md'`)
  - `closeOnOverlayClick`: `boolean` (default: `true`)
  - `closeOnEscape`: `boolean` (default: `true`)
  - `title`: `ReactNode`
  - `description`: `ReactNode`

### 17. `Drawer` / `Sheet`

Edge-anchored slide-over panel for filters, details, or mobile navigation.

- **Key Props**:
  - `open`: `boolean`
  - `onOpenChange`: `(open: boolean) => void`
  - `side`: `'left' | 'right' | 'top' | 'bottom'` (default: `'right'`)
  - `size`: `'sm' | 'md' | 'lg' | 'xl'`
  - `title`: `ReactNode`

### 18. `Tooltip`

Keyboard- and hover-accessible contextual hint (`role="tooltip"`).

- **Key Props**:
  - `content`: `ReactNode`
  - `placement`: `'top' | 'bottom' | 'left' | 'right'` (default: `'top'`)
  - `delayMs`: `number` (default: `200`)
  - `disabled`: `boolean`

### 19. `Toast` / `Toaster`

Non-blocking transient notifications queued at the viewport corner.

- **Key Props**:
  - `variant`: `'info' | 'success' | 'warning' | 'danger'`
  - `title`: `ReactNode`
  - `description`: `ReactNode`
  - `duration`: `number` (default: `5000`)
  - `position`: `'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'`
  - `action`: `{ label: string; onClick: () => void }`

---

## Phase 5: Navigation & Wayfinding

Components for moving between views, sections, and datasets in React and Next.js applications.

### 20. `Tabs` (`Tabs`, `TabList`, `TabTrigger`, `TabContent`)

Roving-tabindex keyboard-accessible tabbed interface (`ArrowLeft` / `ArrowRight` / `Home` / `End`).

- **Key Props**:
  - `value` / `defaultValue`: `string`
  - `onValueChange`: `(value: string) => void`
  - `variant`: `'underline' | 'solid'` (default: `'underline'`)
  - `size`: `'sm' | 'md' | 'lg'`
  - `orientation`: `'horizontal' | 'vertical'` (default: `'horizontal'`)

### 21. `Breadcrumbs` (`Breadcrumbs`, `BreadcrumbItem`)

Hierarchical path navigation (`aria-label="Breadcrumb"`).

- **Key Props**:
  - `separator`: `ReactNode | LucideIcon` (default: `ChevronRight`)
  - `maxItems`: `number` (collapses middle items with ellipsis when exceeded)
  - `href`: `string`
  - `current`: `boolean` (`aria-current="page"`)

### 22. `Pagination`

Page navigation controls for paginated lists and tables.

- **Key Props**:
  - `page`: `number`
  - `totalPages`: `number`
  - `onPageChange`: `(page: number) => void`
  - `siblingCount`: `number` (default: `1`)
  - `showFirstLast`: `boolean` (default: `true`)
  - `size`: `'sm' | 'md' | 'lg'`

### 23. `DropdownMenu`

Action menu triggered by a button (`role="menu"`, arrow-key navigation, typeahead support).

- **Key Props**:
  - `trigger`: `ReactNode`
  - `align`: `'start' | 'center' | 'end'`
  - `items`: `Array<{ id: string; label: ReactNode; icon?: LucideIcon; danger?: boolean; disabled?: boolean; onSelect: () => void }>`

---

## Phase 6: Data Display & Complex Composites

Rich components for displaying structured records, metrics, and user identities.

### 24. `Avatar`

User or entity representation with image, initials fallback, and status indicator.

- **Key Props**:
  - `src`: `string`
  - `alt`: `string`
  - `initials`: `string`
  - `size`: `'xs' | 'sm' | 'md' | 'lg' | 'xl'`
  - `status`: `'online' | 'offline' | 'busy' | 'away'`

### 25. `Table` / `DataTable`

Structured tabular data display with sorting, row selection, and empty/loading states.

- **Key Props**:
  - `columns`: `Array<{ key: string; header: ReactNode; sortable?: boolean; align?: 'left' | 'center' | 'right'; render?: (row: T) => ReactNode }>`
  - `data`: `T[]`
  - `rowKey`: `(row: T) => string`
  - `sortBy`: `{ key: string; direction: 'asc' | 'desc' }`
  - `onSortChange`: `(sort: { key: string; direction: 'asc' | 'desc' }) => void`
  - `selectable`: `boolean`
  - `selectedKeys`: `Set<string>`
  - `onSelectionChange`: `(keys: Set<string>) => void`
  - `density`: `'compact' | 'normal' | 'relaxed'` (default: `'normal'`)
  - `loading`: `boolean`
  - `emptyState`: `ReactNode`

### 26. `ProgressBar`

Linear completion indicator (`role="progressbar"`).

- **Key Props**:
  - `value`: `number` (`0`–`100`)
  - `max`: `number` (default: `100`)
  - `variant`: `'primary' | 'success' | 'warning' | 'danger'`
  - `size`: `'sm' | 'md' | 'lg'`
  - `showValueLabel`: `boolean`
  - `indeterminate`: `boolean`

### 27. `EmptyState`

Placeholder block when lists, tables, or search results return no data.

- **Key Props**:
  - `icon`: `LucideIcon`
  - `title`: `ReactNode`
  - `description`: `ReactNode`
  - `action`: `ReactNode` (e.g., primary `Button`)
