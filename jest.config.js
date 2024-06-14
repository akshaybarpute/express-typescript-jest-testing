module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/dist-test/"],
  testTimeout: 20000,
  moduleNameMapper: {
    // "^@/(.*)$": "<rootDir>/src/$1",
    // "^src/(.*)$": "<rootDir>/src/$1",
    // "^@axios$": "<rootDir>/src/common/axios",
  },
  transform: {
    // "\\.[jt]sx?$": "babel-jest",
    "^.+\\.(ts|tsx)?$": "ts-jest",
  },
};
