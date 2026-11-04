import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  retries: 0,
  reporter: [['list']],
  use: { baseURL: 'http://localhost:4173', trace: 'retain-on-failure' },
  webServer: { command: 'npx vite preview --port 4173 --strictPort', url: 'http://localhost:4173', reuseExistingServer: true, timeout: 60_000 },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    // Firefox and WebKit (Safari's engine) run the route, layout and commerce checks
    { name: 'firefox', use: { browserName: 'firefox' }, grep: /routes|responsive|commerce|round 2/ },
    { name: 'webkit', use: { browserName: 'webkit' }, grep: /routes|responsive|commerce|round 2/ },
  ],
})
