import { defineConfig } from "cypress";
import plugins from "./cypress/plugins/index";

export default defineConfig({
  defaultCommandTimeout: 60000,
  video: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return plugins(on, config);
    },
    baseUrl: "http://localhost:3000/",
    specPattern: "test/e2e/**/*.spec.ts",
    chromeWebSecurity: false,
    env: {
      ERICA_URL: process.env.ERICA_URL,
    },
  },
});
