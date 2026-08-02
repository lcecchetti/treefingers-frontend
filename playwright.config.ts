import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  // tests share one local dev DB/backend; keep runs serial and deterministic
  // rather than reasoning about cross-test interference under parallelism
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 60_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
