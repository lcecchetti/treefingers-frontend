import { describe, it, expect } from 'vitest'
import { getAboutUrl } from './content'

describe('getAboutUrl', () => {
  it('returns the about page path', () => {
    expect(getAboutUrl()).toBe('/about')
  })
})
