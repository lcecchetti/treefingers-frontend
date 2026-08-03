import { describe, it, expect } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import { UIProvider, useUI } from '@/lib/ui/context';
import { Toasts } from './index';

function ShowToastButton({
  label,
  duration,
  type,
}: {
  label: string;
  duration?: number;
  type?: string;
}) {
  const { showToast } = useUI();
  return <button onClick={() => showToast(label, { duration, type })}>show {label}</button>;
}

function ToastCount() {
  const { toasts } = useUI();
  return <span data-testid="toast-count">{toasts.length}</span>;
}

describe('Toasts', () => {
  it('shows a toast added via showToast', async () => {
    render(
      <UIProvider>
        <ShowToastButton label="Hi there" duration={1000} />
        <Toasts />
      </UIProvider>
    );

    await act(async () => {
      screen.getByRole('button').click();
    });

    expect(await screen.findByText('Hi there')).toBeInTheDocument();
  });

  it('removes the toast from the DOM after its duration elapses', async () => {
    render(
      <UIProvider>
        <ShowToastButton label="Bye now" duration={300} />
        <Toasts />
      </UIProvider>
    );

    await act(async () => {
      screen.getByRole('button').click();
    });
    expect(await screen.findByText('Bye now')).toBeInTheDocument();

    await waitFor(
      () => expect(screen.queryByText('Bye now')).not.toBeInTheDocument(),
      { timeout: 3000 }
    );
  });

  it('calls dismissToast so the toast is removed from context state, not just the DOM', async () => {
    render(
      <UIProvider>
        <ShowToastButton label="First" duration={300} />
        <ToastCount />
        <Toasts />
      </UIProvider>
    );

    const [showButton] = screen.getAllByRole('button');
    await act(async () => {
      showButton.click();
    });

    await screen.findByText('First');
    expect(screen.getByTestId('toast-count').textContent).toBe('1');

    // The toast disappearing from context state (not merely from the DOM)
    // is only possible if the bridge actually invoked dismissToast(id) --
    // Sonner has no way to mutate our reducer state itself.
    await waitFor(() => expect(screen.getByTestId('toast-count').textContent).toBe('0'), {
      timeout: 3000,
    });
    // Sonner's exit animation can keep the node mounted briefly after
    // onAutoClose (and thus dismissToast) has already fired.
    await waitFor(() => expect(screen.queryByText('First')).not.toBeInTheDocument(), {
      timeout: 1000,
    });

    // Re-triggering the same label proves the id was properly retired (not
    // just hidden) and a fresh toast with the same text can appear again.
    await act(async () => {
      showButton.click();
    });
    expect(await screen.findByText('First')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId('toast-count').textContent).toBe('0'), {
      timeout: 3000,
    });
  });

  it(
    'keeps a duration: 0 toast visible past Sonner\'s own default lifetime (sticky-toast regression)',
    async () => {
      render(
        <UIProvider>
          <ShowToastButton label="Stick around" duration={0} />
          <Toasts />
        </UIProvider>
      );

      await act(async () => {
        screen.getByRole('button').click();
      });
      expect(await screen.findByText('Stick around')).toBeInTheDocument();

      // Sonner's own default TOAST_LIFETIME is 4000ms (node_modules/sonner
      // dist/index.mjs). A duration: 0 toast must not fall through to that
      // default -- it should stay mounted until manually dismissed. Wait
      // comfortably past 4000ms to prove it wasn't auto-dismissed.
      await new Promise((resolve) => setTimeout(resolve, 4500));
      expect(screen.queryByText('Stick around')).toBeInTheDocument();
    },
    8000
  );

  it('caps the number of toasts handed to Sonner at maxToasts', async () => {
    render(
      <UIProvider>
        <ShowToastButton label="a" duration={5000} />
        <ShowToastButton label="b" duration={5000} />
        <ShowToastButton label="c" duration={5000} />
        <Toasts maxToasts={2} />
      </UIProvider>
    );

    for (const btn of screen.getAllByRole('button')) {
      await act(async () => {
        btn.click();
      });
    }

    await screen.findByText('a');
    await screen.findByText('b');

    // Give Sonner a beat to mount anything it was handed; 'c' should never
    // show up because the bridge itself withholds it, not Sonner.
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(screen.queryByText('c')).not.toBeInTheDocument();
  });
});
