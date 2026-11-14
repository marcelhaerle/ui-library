import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('applies numeric pixel and CSS string dimensions and defaults to aria-hidden', () => {
    const { rerender } = render(<Skeleton data-testid="skeleton" width={120} height={32} />);

    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton.getAttribute('aria-hidden')).toBe('true');
    expect(skeleton.style.width).toBe('120px');
    expect(skeleton.style.height).toBe('32px');
    expect(skeleton.classList.contains('mhui:animate-pulse')).toBe(true);

    rerender(<Skeleton data-testid="skeleton" width="50%" height="2rem" animated={false} />);
    expect(skeleton.style.width).toBe('50%');
    expect(skeleton.style.height).toBe('2rem');
    expect(skeleton.classList.contains('mhui:animate-pulse')).toBe(false);
  });

  it('forwards ref, native attributes, and merges mhui-prefixed classes', () => {
    const ref = createRef<HTMLDivElement>();

    render(<Skeleton ref={ref} id="card-skeleton" className="custom-skeleton mhui:h-10" />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.id).toBe('card-skeleton');
    expect(ref.current?.classList.contains('mhui:h-10')).toBe(true);
    expect(ref.current?.classList.contains('mhui:h-4')).toBe(false);
    expect(ref.current?.classList.contains('custom-skeleton')).toBe(true);
  });
});
