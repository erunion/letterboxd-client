module.exports = {
  coveragePathIgnorePatterns: ['/dist', '/node_modules'],
  modulePaths: ['<rootDir>'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  preset: 'ts-jest/presets/js-with-ts',
  roots: ['<rootDir>'],
  testPathIgnorePatterns: ['<rootDir>/dist/'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(js?|ts?)$',
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: '__tests__/tsconfig.json',
      },
    ],
  },
};
