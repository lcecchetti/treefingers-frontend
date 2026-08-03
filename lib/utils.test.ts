import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('joins plain class strings', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('drops falsy values', () => {
    expect(cn('a', false && 'b', undefined, null, 'c')).toBe('a c');
  });

  it('merges conflicting Tailwind utilities, keeping the last one', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('merges conflicting custom-scale spacing utilities, keeping the last one', () => {
    expect(cn('p-xs', 'p-md')).toBe('p-md');
    expect(cn('gap-sm', 'gap-lg')).toBe('gap-lg');
  });

  it('still merges the standard numeric spacing scale', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });
});
