import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { UIProvider, useUI } from '@/lib/ui/context';
import { Toasts } from './index';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

function ShowToastButton({ label, duration }: { label: string; duration?: number }) {
  const { showToast } = useUI();
  return <button onClick={() => showToast(label, { duration })}>show {label}</button>;
}

describe('Toasts', () => {
  it('renders nothing when there are no toasts', () => {
    const { container } = render(
      <UIProvider>
        <Toasts />
      </UIProvider>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('shows a toast added via showToast, and removes it after its duration', async () => {
    render(
      <UIProvider>
        <ShowToastButton label="Hi there" duration={1000} />
        <Toasts />
      </UIProvider>
    );

    await act(async () => { screen.getByRole('button').click(); });
    expect(screen.getByText('Hi there')).toBeInTheDocument();

    await act(async () => { vi.advanceTimersByTime(1000); });
    expect(screen.queryByText('Hi there')).not.toBeInTheDocument();
  });

  it('caps visible toasts at maxToasts', async () => {
    render(
      <UIProvider>
        <ShowToastButton label="a" duration={0} />
        <ShowToastButton label="b" duration={0} />
        <ShowToastButton label="c" duration={0} />
        <Toasts maxToasts={2} />
      </UIProvider>
    );

    for (const btn of screen.getAllByRole('button')) {
      await act(async () => { btn.click(); });
    }

    expect(screen.getByText('a')).toBeInTheDocument();
    expect(screen.getByText('b')).toBeInTheDocument();
    expect(screen.queryByText('c')).not.toBeInTheDocument();
  });
});
