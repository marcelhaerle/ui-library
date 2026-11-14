import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('renders an accessible status role with default and custom labels', () => {
    const { rerender } = render(<Spinner />);

    const spinner = screen.getByRole('status', { name: 'Loading...' });
    expect(spinner).toBeDefined();
    expect(spinner.querySelector('svg')).not.toBeNull();

    rerender(<Spinner label="Fetching records..." />);
    expect(screen.getByRole('status', { name: 'Fetching records...' })).toBeDefined();
  });

  it('forwards ref, native attributes, and merges mhui-prefixed classes', () => {
    const ref = createRef<HTMLSpanElement>();

    render(
      <Spinner
        ref={ref}
        id="page-spinner"
        size="sm"
        variant="secondary"
        className="custom-spinner mhui:h-10 mhui:w-10"
      />,
    );

    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(ref.current?.id).toBe('page-spinner');
    expect(ref.current?.classList.contains('mhui:h-10')).toBe(true);
    expect(ref.current?.classList.contains('mhui:h-4')).toBe(false);
    expect(ref.current?.classList.contains('custom-spinner')).toBe(true);
  });
});
