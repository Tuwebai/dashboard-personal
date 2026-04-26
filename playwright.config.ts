import { defineConfig } from '@playwright/test';

const baseURL = process.env.E2E_BASE_URL?.trim() || 'http://127.0.0.1:4173';
const shouldStartLocalServer = !process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: 0,
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  webServer: shouldStartLocalServer
    ? {
        command: 'npm run dev -- --port 4173',
        url: 'http://127.0.0.1:4173',
        reuseExistingServer: true,
        timeout: 120000,
      }
    : undefined,
});
