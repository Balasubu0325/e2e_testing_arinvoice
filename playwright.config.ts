import { defineConfig, devices } from '@playwright/test';
// Optional: ALM reporter, enabled when ALM_REPORT_RUN=true
// eslint-disable-next-line @typescript-eslint/no-var-requires
const AlmReporter = (() => {
  try {
    // dynamic require to avoid TS transpile issues if file not present at runtime
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('./utils/alm-reporter');
  } catch {
    return null;
  }
})();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: AlmReporter && process.env.ALM_REPORT_RUN === 'true'
    ? [['html'], [AlmReporter]]
    : 'html',
  use: {
    // Enable rich recording when RECORD_ALL=1; otherwise keep defaults
    trace: process.env.RECORD_ALL === '1' ? 'on' : 'on-first-retry',
    video: process.env.RECORD_ALL === '1' || process.env.RECORD_VIDEO === '1' ? 'on' : 'retain-on-failure',
    screenshot: process.env.RECORD_ALL === '1' || process.env.RECORD_SCREENSHOTS === '1' ? 'on' : 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome'
      },
    },
  ],
});
