module.exports = {
    roots: ['<rootDir>/src'],
    setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
    moduleNameMapper: {
        '\\.(css|sass|scss)$': 'identity-obj-proxy',
        '\\.(svg)$': '<rootDir>/mocks/file-mock.js',
        '~(.*)$': '<rootDir>/src/$1',
    },
    testRegex: '(\\.test)\\.(ts|tsx)$',
};
