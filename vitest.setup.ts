import '@testing-library/jest-dom/vitest'

// jsdom doesn't implement matchMedia. Sonner (via components/common/toasts)
// queries it to resolve the "system" theme, and Toasts is mounted globally
// by app/providers.tsx, so any test that renders it needs this polyfill.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
}
