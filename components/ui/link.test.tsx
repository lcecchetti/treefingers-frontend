import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Link } from './link';

describe('Link', () => {
  it('renders an anchor with the given href', () => {
    render(<Link href="/about">About</Link>);
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
  });

  it('adds the underline class when underline is set', () => {
    render(<Link href="/about" underline>About</Link>);
    expect(screen.getByRole('link', { name: 'About' })).toHaveClass('underline');
  });

  it('lets a passed className override the default hover opacity', () => {
    render(<Link href="/about" className="hover:opacity-100">About</Link>);
    const link = screen.getByRole('link', { name: 'About' });
    expect(link).toHaveClass('hover:opacity-100');
    expect(link).not.toHaveClass('hover:opacity-80');
  });
});
