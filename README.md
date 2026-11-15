# `@haerlemarcel/ui-library`

An accessible, modern React 19+ and Next.js (App Router) UI component library built with TypeScript and Tailwind CSS v4.

## Documentation & Storybook

Browse interactive component stories, variants, and documentation on GitHub Pages:

**[https://marcelhaerle.github.io/ui-library/](https://marcelhaerle.github.io/ui-library/)**

---

## Installation

```bash
npm install @haerlemarcel/ui-library
```

Import the library stylesheet once at the root of your application (e.g., `app/layout.tsx` in Next.js or `main.tsx` in Vite/React):

```tsx
import '@haerlemarcel/ui-library/styles.css';
```

> **Note:** All Tailwind utility classes and CSS theme variables inside `@haerlemarcel/ui-library` are namespaced with the `mhui` prefix (e.g., `mhui:bg-blue-900`, `--mhui-spacing`) so they never collide with or override your host application's styles.

---

## Light & Dark Mode

All components in `@haerlemarcel/ui-library` support **Light** and **Dark** mode out of the box with zero runtime overhead.

Dark mode styles activate automatically whenever an ancestor element (such as `<html>`, `<body>`, or a section container) has either:

1. The **`.dark` CSS class** (`<html class="dark">`), or
2. The **`data-theme="dark"` attribute** (`<html data-theme="dark">`).

### 1. Next.js (App Router) with `next-themes`

Install `next-themes`:

```bash
npm install next-themes
```

Create a `ThemeProvider` wrapper and include it in your root `app/layout.tsx`:

```tsx
// app/layout.tsx
import type { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import '@haerlemarcel/ui-library/styles.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Works with either attribute="class" or attribute="data-theme" */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

Toggle the theme from any client component:

```tsx
'use client';

import { useTheme } from 'next-themes';
import { Button } from '@haerlemarcel/ui-library';

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button variant="outline" onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
      Switch to {resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode
    </Button>
  );
};
```

### 2. Pure React Applications

Toggle the `.dark` class (or `data-theme="dark"` attribute) on `document.documentElement`:

```tsx
import { Button } from '@haerlemarcel/ui-library';
import '@haerlemarcel/ui-library/styles.css';

export const App = () => {
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <main>
      <Button variant="primary" onClick={toggleDarkMode}>
        Toggle Dark Mode
      </Button>
    </main>
  );
};
```

### 3. Scoped Dark Mode Sections

You can also scope dark mode to a specific container on a page without changing the global document theme:

```tsx
<section className="dark bg-slate-950 p-6">
  <Button variant="outline">Scoped Dark Button</Button>
</section>
```
