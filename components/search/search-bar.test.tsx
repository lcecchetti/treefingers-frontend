import { describe, it, expect, vi } from 'vitest';
import { useEffect } from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { UIProvider, useUI } from '@/lib/ui/context';
import { SearchBar } from './search-bar';

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  useSearchParams: () => new URLSearchParams(),
}));

function OpenSearchOnMount() {
  const { openSearch } = useUI();
  useEffect(() => {
    openSearch();
  }, [openSearch]);
  return null;
}

describe('SearchBar', () => {
  it('renders nothing interactive while search is closed', () => {
    render(
      <UIProvider>
        <SearchBar />
      </UIProvider>
    );
    expect(screen.queryByPlaceholderText('Search')).not.toBeInTheDocument();
  });

  it('requires at least 3 characters before submitting', async () => {
    const user = userEvent.setup();
    render(
      <UIProvider>
        <OpenSearchOnMount />
        <SearchBar />
      </UIProvider>
    );

    const input = await screen.findByPlaceholderText('Search');
    await user.type(input, 'ab');
    // FormField only renders its error text once the field is touched
    // (form-field.tsx), which RHF marks on blur. Pressing Enter inside the
    // input submits without blurring it, so click the submit button instead
    // to both blur the input and trigger validation.
    await user.click(screen.getByRole('button', { name: '' }));

    expect(await screen.findByText("C'mon, be more precise!")).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('navigates to the search results page on valid submit', async () => {
    const user = userEvent.setup();
    render(
      <UIProvider>
        <OpenSearchOnMount />
        <SearchBar />
      </UIProvider>
    );

    const input = await screen.findByPlaceholderText('Search');
    await user.type(input, 'dragons');
    await user.keyboard('{Enter}');

    expect(pushMock).toHaveBeenCalledWith('/search?q=dragons');
  });
});
