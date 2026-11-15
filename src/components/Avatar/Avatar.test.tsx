import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('renders the image when src is provided and falls back to initials on error', () => {
    render(<Avatar src="https://example.com/avatar.png" alt="Marcel Haerle" initials="MH" />);

    const img = screen.getByRole('img', { name: 'Marcel Haerle' });
    expect(img.tagName).toBe('IMG');
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.png');

    fireEvent.error(img);

    const fallback = screen.getByRole('img', { name: 'Marcel Haerle' });
    expect(fallback.tagName).toBe('SPAN');
    expect(fallback).toHaveTextContent('MH');
  });

  it('derives initials from alt when initials prop is omitted', () => {
    render(<Avatar alt="Ada Lovelace" />);

    const fallback = screen.getByRole('img', { name: 'Ada Lovelace' });
    expect(fallback).toHaveTextContent('AL');
  });

  it('renders the presence status indicator when status is provided', () => {
    render(<Avatar initials="MH" alt="Marcel Haerle" status="online" />);

    const statusBadge = screen.getByRole('status', { name: 'Status: online' });
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveAttribute('data-status', 'online');
  });
});
