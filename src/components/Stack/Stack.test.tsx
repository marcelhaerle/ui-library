import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Stack } from './Stack';

describe('Stack', () => {
  it('renders children inside a flex container and applies direction, gap, align, justify, and wrap', () => {
    render(
      <Stack
        data-testid="stack"
        direction="horizontal"
        gap="lg"
        align="center"
        justify="between"
        wrap
      >
        <span>Item 1</span>
        <span>Item 2</span>
      </Stack>,
    );

    const stack = screen.getByTestId('stack');
    expect(stack.tagName).toBe('DIV');
    expect(stack.className).toContain('mhui:flex-row');
    expect(stack.className).toContain('mhui:gap-6');
    expect(stack.className).toContain('mhui:items-center');
    expect(stack.className).toContain('mhui:justify-between');
    expect(stack.className).toContain('mhui:flex-wrap');
  });

  it('supports semantic HTML rendering via the as prop and forwards ref', () => {
    const ref = createRef<HTMLElement>();

    render(
      <Stack ref={ref} as="nav" aria-label="Main navigation">
        <a href="#overview">Overview</a>
      </Stack>,
    );

    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(nav.tagName).toBe('NAV');
    expect(ref.current).toBe(nav);
  });
});
