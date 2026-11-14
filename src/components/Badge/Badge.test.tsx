import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Tag } from 'lucide-react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children and optional icon without a remove button by default', () => {
    render(<Badge icon={Tag}>Category</Badge>);

    const badge = screen.getByText('Category');
    expect(badge.tagName).toBe('SPAN');
    expect(badge.querySelector('svg')).not.toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('renders a remove button when removable is true and calls onRemove without bubbling click', async () => {
    const user = userEvent.setup();
    const handleRemove = vi.fn();
    const handleParentClick = vi.fn();

    render(
      <div role="presentation" onClick={handleParentClick}>
        <Badge removable onRemove={handleRemove} removeLabel="Remove filter">
          Active Filter
        </Badge>
      </div>,
    );

    const removeButton = screen.getByRole('button', { name: 'Remove filter' });
    await user.click(removeButton);

    expect(handleRemove).toHaveBeenCalledTimes(1);
    expect(handleParentClick).not.toHaveBeenCalled();
  });

  it('supports keyboard activation on the remove button', async () => {
    const user = userEvent.setup();
    const handleRemove = vi.fn();

    render(
      <Badge removable onRemove={handleRemove} removeLabel="Remove tag">
        TypeScript
      </Badge>,
    );

    const removeButton = screen.getByRole('button', { name: 'Remove tag' });
    removeButton.focus();

    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(handleRemove).toHaveBeenCalledTimes(2);
  });

  it('forwards ref, native attributes, and merges mhui-prefixed classes', () => {
    const ref = createRef<HTMLSpanElement>();

    render(
      <Badge
        ref={ref}
        id="status-badge"
        variant="secondary"
        size="sm"
        className="custom-badge mhui:px-4"
      >
        Status
      </Badge>,
    );

    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(ref.current?.id).toBe('status-badge');
    expect(ref.current?.classList.contains('mhui:px-4')).toBe(true);
    expect(ref.current?.classList.contains('mhui:px-2')).toBe(false);
    expect(ref.current?.classList.contains('custom-badge')).toBe(true);
  });
});
