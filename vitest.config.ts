import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    // .worktrees/worktrees are excluded so running from the main checkout
    // doesn't recurse into a linked worktree's own nested node_modules/e2e
    exclude: ['node_modules/**', 'e2e/**', '.next/**', '.worktrees/**', 'worktrees/**'],
    // lib/env.ts validates this at import time (via @t3-oss/env-nextjs); several
    // modules under test (apollo/client, auth/logout) import it transitively.
    env: {
      NEXT_PUBLIC_GRAPHQL_ENDPOINT: 'http://localhost:4000/graphql',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
