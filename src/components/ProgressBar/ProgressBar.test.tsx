import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('computes percentage, clamps out-of-range values, and exposes ARIA progressbar attributes', () => {
    const { rerender } = render(
      <ProgressBar label="Upload progress" value={25} max={50} showValueLabel />,
    );

    const bar = screen.getByRole('progressbar', { name: 'Upload progress' });
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '50');
    expect(bar).toHaveAttribute('aria-valuenow', '25');
    expect(bar).toHaveAttribute('aria-valuetext', '50%');
    expect(screen.getByText('50%')).toBeInTheDocument();

    rerender(<ProgressBar label="Upload progress" value={180} max={100} showValueLabel />);
    expect(screen.getByRole('progressbar', { name: 'Upload progress' })).toHaveAttribute(
      'aria-valuenow',
      '100',
    );
    expect(screen.getByText('100%')).toBeInTheDocument();

    rerender(<ProgressBar label="Upload progress" value={-20} max={100} showValueLabel />);
    expect(screen.getByRole('progressbar', { name: 'Upload progress' })).toHaveAttribute(
      'aria-valuenow',
      '0',
    );
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('omits aria-valuenow and percentage label when indeterminate is true', () => {
    render(<ProgressBar label="Processing" value={60} showValueLabel indeterminate />);

    const bar = screen.getByRole('progressbar', { name: 'Processing' });
    expect(bar).not.toHaveAttribute('aria-valuenow');
    expect(bar).not.toHaveAttribute('aria-valuetext');
    expect(bar).toHaveAttribute('data-indeterminate', 'true');
    expect(screen.queryByText('60%')).not.toBeInTheDocument();
  });
});
