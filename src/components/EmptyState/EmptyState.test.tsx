import '@testing-library/jest-dom/vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FolderOpen } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../Button';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders title, description, icon, and triggers the action button', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    render(
      <EmptyState
        icon={FolderOpen}
        title="No records found"
        description="Create your first record to populate this view."
        action={<Button onClick={onAction}>Create Record</Button>}
      />,
    );

    expect(screen.getByRole('heading', { name: 'No records found' })).toBeInTheDocument();
    expect(screen.getByText('Create your first record to populate this view.')).toBeInTheDocument();

    const actionButton = screen.getByRole('button', { name: 'Create Record' });
    await user.click(actionButton);

    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('forwards ref and native attributes when optional props are omitted', () => {
    const ref = createRef<HTMLDivElement>();

    render(<EmptyState ref={ref} data-testid="empty-block" title="Empty queue" />);

    expect(ref.current).toBe(screen.getByTestId('empty-block'));
    expect(screen.getByRole('heading', { name: 'Empty queue' })).toBeInTheDocument();
  });
});
