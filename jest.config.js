module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    'lib/**/*.js',
    'bin/**/*.js',
<<<<<<< HEAD
    '!lib/plugin.js',
    '!lib/module.js'
=======
    '!lib/plugin.js'
>>>>>>> dev
  ],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/lib/$1',
    '^~~$': '<rootDir>',
    '^@@$': '<rootDir>',
<<<<<<< HEAD
    '^@/(.*)$': '<rootDir>/lib/$1',
=======
    '^@/(.*)$': '<rootDir>/lib/$1'
>>>>>>> dev
  },
  transform: {
    '^.+\\.js$': 'babel-jest'
  }
}
