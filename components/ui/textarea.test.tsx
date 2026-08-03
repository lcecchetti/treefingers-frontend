import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Textarea } from './textarea';

describe('Textarea', () => {
  it('renders a rounded-xl textarea with the base border/background classes', () => {
    render(<Textarea aria-label="bio" />);
    const textarea = screen.getByLabelText('bio');
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveClass('rounded-xl', 'border-primary', 'bg-primary-contrast', 'w-full');
  });

  it('forwards a ref to the underlying element', () => {
    let ref: HTMLTextAreaElement | null = null;
    render(<Textarea aria-label="bio" ref={(el) => { ref = el; }} />);
    expect(ref).toBeInstanceOf(HTMLTextAreaElement);
  });
});
