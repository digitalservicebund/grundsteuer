module.exports = {
  testEnvironment: "jsdom",
  moduleDirectories: ["node_modules", "<rootDir>/app"],
  moduleNameMapper: {
    "~/(.*)": "<rootDir>/app/$1",
    "test/(.*)": "<rootDir>/test/$1",
    "testUtil/(.*)": "<rootDir>/private/jest/util/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/test/e2e"],
  setupFiles: [
    "<rootDir>/private/jest/setup.ts",
    "<rootDir>/private/jest/setEnvVars.js",
  ],
  setupFilesAfterEnv: ["<rootDir>/private/jest/setupAfterEnv.js"],
  transform: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/private/jest/fileTransformer.js",
  },
  preset: "ts-jest",
};
process.env = Object.assign(process.env, {
  APP_ENV: "local",
  DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/grundsteuer",
  SESSION_COOKIE_SECRET: "s3cr3t",
  FORM_COOKIE_SECRET: "s3cr3t",
  ERICA_URL: "http://localhost:8000",
});
