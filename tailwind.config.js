module.exports = {
  presets: [require("@digitalservice4germany/style-dictionary/tailwind")],
  content: [
    "./app/**/*.{ts,tsx}",
    "./node_modules/@digitalservice4germany/digital-service-library/dist/esm/index.js",
  ],
  theme: {
    fontFamily: {
      sans: [
        "BundesSansWeb",
        "Calibri",
        "Verdana",
        "Arial",
        "Helvetica",
        "sans-serif",
      ],
      serif: [
        "BundesSerifWeb",
        "Cambria",
        "Georgia",
        "Times New Roman",
        "serif",
      ],
      condensed: [
        "BundesSansCondWeb",
        "Calibri",
        "Verdana",
        "Arial",
        "Helvetica",
        "sans-serif",
      ],
    },
  },
};
