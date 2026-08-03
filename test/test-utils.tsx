import { Suspense, type ReactElement } from 'react'
import { render, act, type RenderResult } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing/react'
import type { MockedResponse } from '@apollo/client/testing'
import { UIProvider } from '@/lib/ui/context'

function Providers({ mocks, children }: { mocks: readonly MockedResponse[]; children: ReactElement }) {
  return (
    <MockedProvider mocks={mocks}>
      <UIProvider>
        <Suspense fallback={<div data-testid="suspense-fallback">Loading...</div>}>
          {children}
        </Suspense>
      </UIProvider>
    </MockedProvider>
  )
}

export function renderWithProviders(
  ui: ReactElement,
  options: { mocks?: readonly MockedResponse[] } = {}
): RenderResult {
  const { mocks = [] } = options
  return render(<Providers mocks={mocks}>{ui}</Providers>)
}

// Suspense-aware variant: components using useSuspenseQuery suspend on their
// first render. Under React 19 + Testing Library the initial render must happen
// inside an awaited `act` for the post-resolution retry to commit, otherwise the
// tree stays stuck on the Suspense fallback. Await this for such components.
export async function renderWithProvidersAsync(
  ui: ReactElement,
  options: { mocks?: readonly MockedResponse[] } = {}
): Promise<RenderResult> {
  const { mocks = [] } = options
  let result!: RenderResult
  await act(async () => {
    result = render(<Providers mocks={mocks}>{ui}</Providers>)
    // let MockLink's delayed response resolve so the suspended tree can retry
    await new Promise((resolve) => setTimeout(resolve, 100))
  })
  return result
}

export * from '@testing-library/react'
