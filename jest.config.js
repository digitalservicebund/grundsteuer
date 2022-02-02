module.exports = {
  testEnvironment: "node",
  moduleDirectories: ["node_modules", "<rootDir>/app"],
  moduleNameMapper: {
    "~/(.*)": "<rootDir>/app/$1",
    "test/(.*)": "<rootDir>/test/$1",
  },
  setupFiles: ["<rootDir>/private/jest/setup.js"],
};
