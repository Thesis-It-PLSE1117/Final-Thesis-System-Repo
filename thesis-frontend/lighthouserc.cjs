// Lighthouse CI Configuration
module.exports = {
  ci: {
    collect: {
      // URL(s) to test
      url: ['http://localhost:4173/'],
      numberOfRuns: 3,
      startServerCommand: 'npm run preview',
      startServerReadyPattern: 'Local:',
      settings: {
        preset: 'desktop',
        // Additional settings
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1
        },
        screenEmulation: {
          mobile: false,
          width: 1920,
          height: 1080,
          deviceScaleFactor: 1,
          disabled: false
        }
      }
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        // Performance metrics thresholds
        'categories:performance': ['error', {minScore: 0.8}],
        'categories:accessibility': ['warn', {minScore: 0.9}],
        'categories:best-practices': ['warn', {minScore: 0.9}],
        'categories:seo': ['warn', {minScore: 0.9}],
        
        // Specific metrics
        'first-contentful-paint': ['warn', {maxNumericValue: 2000}],
        'largest-contentful-paint': ['warn', {maxNumericValue: 2500}],
        'total-blocking-time': ['warn', {maxNumericValue: 300}],
        'cumulative-layout-shift': ['warn', {maxNumericValue: 0.1}],
        
        // Bundle size checks
        'resource-summary:script:size': ['warn', {maxNumericValue: 300000}],
        'resource-summary:total:size': ['warn', {maxNumericValue: 500000}],
        
        // Accessibility
        'color-contrast': 'warn',
        'heading-order': 'warn',
        'image-alt': 'error',
        
        // Best practices
        'no-vulnerable-libraries': 'error',
        'errors-in-console': 'warn',
        'uses-http2': 'warn'
      }
    },
    upload: {
      target: 'temporary-public-storage',
      // Or use filesystem for local storage
      // target: 'filesystem',
      // outputDir: './lighthouse-results'
    }
  }
};
