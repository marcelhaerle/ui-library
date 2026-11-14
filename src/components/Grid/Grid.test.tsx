import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Grid } from './Grid';

describe('Grid', () => {
  it('renders a grid container with the configured columns, gap, and align classes', () => {
    render(
      <Grid data-testid="grid" columns={4} gap="lg" align="center">
        <div>Cell 1</div>
        <div>Cell 2</div>
      </Grid>,
    );

    const grid = screen.getByTestId('grid');
    expect(grid.tagName).toBe('DIV');
    expect(grid.className).toContain('mhui:grid');
    expect(grid.className).toContain('mhui:grid-cols-4');
    expect(grid.className).toContain('mhui:gap-6');
    expect(grid.className).toContain('mhui:items-center');
  });

  it('supports semantic HTML rendering via the as prop and forwards ref', () => {
    const ref = createRef<HTMLElement>();

    render(
      <Grid ref={ref} as="section" aria-label="Metrics Grid" columns={2}>
        <div>Metric A</div>
      </Grid>,
    );

    const section = screen.getByRole('region', { name: 'Metrics Grid' });
    expect(section.tagName).toBe('SECTION');
    expect(ref.current).toBe(section);
  });
});
