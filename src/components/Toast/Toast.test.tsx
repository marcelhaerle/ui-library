import { createRef } from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Toast, Toaster, ToastProvider, useToast } from './Toast';

const ToastTriggerConsumer = () => {
  const { toast } = useToast();

  return (
    <button
      type="button"
      onClick={() =>
        toast({
          variant: 'success',
          title: 'Saved',
          description: 'Settings updated.',
          duration: 0,
        })
      }
    >
      Notify
    </button>
  );
};

describe('Toast & Toaster', () => {
  it('auto-dismisses after duration ms and invokes action and onDismiss callbacks', async () => {
    vi.useFakeTimers();
    const handleDismiss = vi.fn();
    const handleAction = vi.fn();

    render(
      <Toast
        variant="danger"
        title="Upload failed"
        description="Network timeout"
        duration={3000}
        action={{ label: 'Retry', onClick: handleAction }}
        onDismiss={handleDismiss}
      />,
    );

    expect(screen.getByRole('alert')).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(handleDismiss).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('queues notifications via ToastProvider/useToast and dismisses them on click', async () => {
    const user = userEvent.setup();

    render(
      <ToastProvider position="top-right">
        <ToastTriggerConsumer />
      </ToastProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Notify' }));

    expect(screen.getByText('Saved')).toBeTruthy();
    expect(screen.getByText('Settings updated.')).toBeTruthy();
    expect(screen.getByLabelText('Notifications').getAttribute('data-position')).toBe('top-right');

    await user.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    expect(screen.queryByText('Saved')).toBeNull();
  });

  it('forwards refs to Toast and Toaster', () => {
    const toastRef = createRef<HTMLDivElement>();
    const toasterRef = createRef<HTMLDivElement>();

    render(
      <div>
        <Toast ref={toastRef} title="Direct toast" duration={0} />
        <Toaster ref={toasterRef} position="bottom-left" />
      </div>,
    );

    expect(toastRef.current).toBeInstanceOf(HTMLDivElement);
    expect(toasterRef.current).toBeInstanceOf(HTMLDivElement);
  });
});
