import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Label } from './Label';

describe('Label', () => {
  it('associates with an input via htmlFor and renders required indicator when required', () => {
    render(
      <div>
        <Label htmlFor="username" required>
          Username
        </Label>
        <input id="username" type="text" />
      </div>,
    );

    const input = screen.getByLabelText(/Username/);
    expect(input).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByText('*').getAttribute('aria-hidden')).toBe('true');
  });

  it('forwards ref, native attributes, and merges mhui-prefixed classes', () => {
    const ref = createRef<HTMLLabelElement>();

    render(
      <Label ref={ref} id="custom-label" size="sm" className="custom-label mhui:text-lg">
        Custom Label
      </Label>,
    );

    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
    expect(ref.current?.id).toBe('custom-label');
    expect(ref.current?.classList.contains('mhui:text-lg')).toBe(true);
    expect(ref.current?.classList.contains('mhui:text-xs')).toBe(false);
    expect(ref.current?.classList.contains('custom-label')).toBe(true);
  });
});
