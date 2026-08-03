import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormField } from './form-field';

describe('FormField', () => {
  it('renders a labeled text input by default', () => {
    render(<FormField name="email" label="Email" />);
    expect(screen.getByLabelText('Email').tagName).toBe('INPUT');
  });

  it('renders a textarea when type is textarea', () => {
    render(<FormField name="bio" label="Bio" type="textarea" />);
    expect(screen.getByLabelText('Bio').tagName).toBe('TEXTAREA');
  });

  it('renders a select with options when type is select', () => {
    render(
      <FormField
        name="forest"
        label="Forest"
        type="select"
        options={[{ value: '1', label: 'One' }, { value: '2', label: 'Two' }]}
      />
    );
    const select = screen.getByLabelText('Forest');
    expect(select.tagName).toBe('SELECT');
    expect(screen.getByRole('option', { name: 'One' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Two' })).toBeInTheDocument();
  });

  it('shows the hint when there is no error', () => {
    render(<FormField name="email" label="Email" hint="We will never share this" />);
    expect(screen.getByText('We will never share this')).toBeInTheDocument();
  });

  it('shows the error message instead of the hint once touched', () => {
    render(
      <FormField
        name="email"
        label="Email"
        hint="We will never share this"
        error="Invalid email"
        touched
      />
    );
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
    expect(screen.queryByText('We will never share this')).not.toBeInTheDocument();
  });

  it('does not show the error message before the field is touched', () => {
    render(<FormField name="email" label="Email" error="Invalid email" />);
    expect(screen.queryByText('Invalid email')).not.toBeInTheDocument();
  });

  it('forwards onChange to the underlying input', () => {
    const onChange = vi.fn();
    render(<FormField name="email" label="Email" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.com' } });
    expect(onChange).toHaveBeenCalled();
  });
});
