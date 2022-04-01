module.exports = {
  testEnvironment: "jsdom",
  moduleDirectories: ["node_modules", "<rootDir>/app"],
  moduleNameMapper: {
    "~/(.*)": "<rootDir>/app/$1",
    "test/(.*)": "<rootDir>/test/$1",
    "testUtil/(.*)": "<rootDir>/private/jest/util/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/test/e2e"],
  setupFiles: ["<rootDir>/private/jest/setup.js"],
  setupFilesAfterEnv: ["<rootDir>/private/jest/setupAfterEnv.js"],
  transform: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/private/jest/fileTransformer.js",
  },
  preset: "ts-jest",
};
