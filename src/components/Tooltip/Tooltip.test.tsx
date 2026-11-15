import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('shows tooltip with role="tooltip" on hover/focus, wires aria-describedby, and hides on Escape or blur', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Copy API key" delayMs={0} placement="bottom">
        <button type="button">Copy</button>
      </Tooltip>,
    );

    const trigger = screen.getByRole('button', { name: 'Copy' });
    expect(screen.queryByRole('tooltip')).toBeNull();

    await user.hover(trigger);
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip.textContent).toBe('Copy API key');
    expect(tooltip.getAttribute('data-placement')).toBe('bottom');
    expect(trigger.getAttribute('aria-describedby')).toBe(tooltip.id);

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('tooltip')).toBeNull();

    await user.unhover(trigger);
    await user.tab();
    expect(document.activeElement).toBe(trigger);
    expect(screen.getByRole('tooltip')).toBeTruthy();

    await user.tab();
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('does not show tooltip when disabled is true and forwards ref', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLSpanElement>();

    render(
      <Tooltip ref={ref} content="Hidden hint" delayMs={0} disabled>
        <button type="button">Action</button>
      </Tooltip>,
    );

    expect(ref.current).toBeInstanceOf(HTMLSpanElement);

    const trigger = screen.getByRole('button', { name: 'Action' });
    await user.hover(trigger);
    await user.tab();

    expect(screen.queryByRole('tooltip')).toBeNull();
  });
});
