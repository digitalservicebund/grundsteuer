module.exports = {
  presets: [require("@digitalservice4germany/style-dictionary/tailwind")],
  content: [
    "./app/**/*.{ts,tsx}",
    "./node_modules/@digitalservice4germany/digital-service-library/dist/esm/index.js",
  ],
};
