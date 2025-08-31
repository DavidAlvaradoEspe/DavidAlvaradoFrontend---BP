module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
  ],
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$'
      }
    ]
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^app/(.*)$': '<rootDir>/src/app/$1',
    '^environments/(.*)$': '<rootDir>/src/environments/$1',
  },
  moduleFileExtensions: ['ts','html','js','json' ,'mjs'],
  testMatch: ['**/?(*.)+(spec).ts'],
  collectCoverage: true,
  coverageDirectory: 'jest-coverage',
  coverageReporters: ['html', 'text-summary'],
  collectCoverageFrom: [
    'src/app/**/*.{ts,html}',
    '!src/main.ts',
    '!src/environments/**'
  ],
  coverageThreshold: { global: {branches: 70, functions: 70, lines: 70, statements: 70 } },
}
