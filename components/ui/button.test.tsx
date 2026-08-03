import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('defaults to the primary variant and md size classes', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toHaveClass('bg-primary', 'text-primary-contrast', 'py-sm', 'px-md');
  });

  it('applies outlined variant and lg size classes', () => {
    render(<Button variant="outlined" size="lg">Big</Button>);
    const button = screen.getByRole('button', { name: 'Big' });
    expect(button).toHaveClass('border-primary', 'border-2', 'text-xl');
  });

  it('renders as a different element via the as prop', () => {
    render(<Button as="a" href="/somewhere">Go</Button>);
    const link = screen.getByRole('link', { name: 'Go' });
    expect(link).toHaveAttribute('href', '/somewhere');
  });

  it('shows a spin icon when loading', () => {
    render(<Button loading>Submitting</Button>);
    const button = screen.getByRole('button', { name: /Submitting/ });
    expect(button.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('does not show a spin icon when not loading', () => {
    render(<Button>Submitting</Button>);
    const button = screen.getByRole('button', { name: 'Submitting' });
    expect(button.querySelector('.animate-spin')).not.toBeInTheDocument();
  });

  it('merges a custom className without dropping variant classes', () => {
    render(<Button className="mt-lg">Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toHaveClass('mt-lg', 'bg-primary');
  });
});
