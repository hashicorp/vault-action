import { defineConfig, configDefaults } from 'vitest/config'

export default defineConfig({
  test: {
    // required to make jest-when work with vitest
    globals: true,
    include: [
        '**/integrationTests/e2e-tls/**.{test,spec}.?(c|m)[jt]s?(x)',
    ],
  },
})
