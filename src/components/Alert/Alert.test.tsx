import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Alert } from './Alert';

describe('Alert', () => {
  it('assigns role="status" for info/success variants and role="alert" for warning/danger variants', () => {
    const { rerender } = render(
      <Alert variant="info" title="Information">
        System notice
      </Alert>,
    );

    expect(screen.getByRole('status')).toBeTruthy();

    rerender(
      <Alert variant="danger" title="Critical failure">
        Node unreachable
      </Alert>,
    );

    expect(screen.getByRole('alert')).toBeTruthy();
  });

  it('invokes onDismiss when the dismiss button is clicked', async () => {
    const user = userEvent.setup();
    const handleDismiss = vi.fn();

    render(
      <Alert variant="warning" title="Quota warning" dismissible onDismiss={handleDismiss}>
        90% of storage quota used.
      </Alert>,
    );

    const dismissButton = screen.getByRole('button', { name: 'Dismiss alert' });
    await user.click(dismissButton);

    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });

  it('renders custom action content, hides icon when icon={false}, and forwards ref', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Alert
        ref={ref}
        variant="success"
        icon={false}
        title="Backup ready"
        action={<button type="button">Download</button>}
      >
        Snapshot completed.
      </Alert>,
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.querySelector('svg')).toBeNull();
    expect(screen.getByRole('button', { name: 'Download' })).toBeTruthy();
  });
});
