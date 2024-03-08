import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // required to make jest-when work with vitest
    globals: true,
  },
})
