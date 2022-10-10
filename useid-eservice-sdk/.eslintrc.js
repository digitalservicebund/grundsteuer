module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 10,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "jest"],
  rules: { "no-eval": "error" },
  ignorePatterns: ["dist"],
};