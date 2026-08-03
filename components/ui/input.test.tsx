import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from './input';

describe('Input', () => {
  it('renders a rounded-full input with the base border/background classes', () => {
    render(<Input aria-label="email" type="email" />);
    const input = screen.getByLabelText('email');
    expect(input).toHaveClass('rounded-full', 'border-primary', 'bg-primary-contrast', 'w-full');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('forwards a ref to the underlying element', () => {
    let ref: HTMLInputElement | null = null;
    render(<Input aria-label="email" ref={(el) => { ref = el; }} />);
    expect(ref).toBeInstanceOf(HTMLInputElement);
  });

  it('merges a custom className', () => {
    render(<Input aria-label="email" className="mt-lg" />);
    expect(screen.getByLabelText('email')).toHaveClass('mt-lg', 'rounded-full');
  });
});
