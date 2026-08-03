import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Label } from './label';
import { Input } from './input';

describe('Label', () => {
  it('associates with a field via htmlFor/id', () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <Input id="email" aria-label={undefined} />
      </>
    );
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });
});
