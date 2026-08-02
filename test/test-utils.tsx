import type { ReactElement } from 'react'
import { render, type RenderResult } from '@testing-library/react'
import { MockedProvider, type MockedResponse } from '@apollo/client/testing'
import { UIProvider } from '@/lib/ui/context'

export function renderWithProviders(
  ui: ReactElement,
  options: { mocks?: readonly MockedResponse[] } = {}
): RenderResult {
  const { mocks = [] } = options

  return render(
    <MockedProvider mocks={mocks}>
      <UIProvider>{ui}</UIProvider>
    </MockedProvider>
  )
}

export * from '@testing-library/react'
