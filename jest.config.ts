import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // so @/util/... works in tests
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}

export default config
