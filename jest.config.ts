import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: "src",
    modulePaths: ['.'],
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ["**/*.(t|j)s"],
    coveragePathIgnorePatterns: [
        'src/common/',
        'src/database/',
        'src/config',
    ],
    coverageDirectory: '../coverage',
    testEnvironment: 'node',
};

export default config;


// "jest": {
//     "moduleFileExtensions": [
//       "js",
//       "json",
//       "ts"
//     ],
//     "rootDir": "src",
//     "testRegex": ".*\\.spec\\.ts$",
//     "transform": {
//       "^.+\\.(t|j)s$": "ts-jest"
//     },
//     "collectCoverageFrom": [
//       "**/*.(t|j)s"
//     ],
//     "coverageDirectory": "../coverage",
//     "testEnvironment": "node"
//   }