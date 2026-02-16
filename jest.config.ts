export default {
    testEnvironment: 'jsdom',
    setupFiles: ['./jest.setup.js'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
    collectCoverage: true,
    collectCoverageFrom: [
      '!ci/**',
      '!dist/**',
      '!coverage/**',
      '!public/**',
      '!tests/**',
      '!src/**/*.test.tsx',
      '!src/**/*.interface.ts',
      '!src/**/*.entity.ts',
      '!babel.config.js',
      '!jest.config.js',
    ],
    testPathIgnorePatterns: [
      '/node_modules/',
      '/.next/',
    ],
    coverageDirectory: 'coverage',
  };
  