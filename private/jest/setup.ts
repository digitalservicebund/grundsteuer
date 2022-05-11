import { mockDeep } from "jest-mock-extended";
import { PrismaClient as OriginalPrismaClient } from "@prisma/client";

/* eslint-disable @typescript-eslint/no-var-requires */
const i18n = require("i18next");
const { initReactI18next } = require("react-i18next");
const { installGlobals } = require("@remix-run/node");
/* eslint-enable @typescript-eslint/no-var-requires */

i18n.use(initReactI18next).init(() => ({
  fallbackLng: "de",
  supportedLanguages: ["de"],
  i18nextOptions: { returnObjects: true },
}));

if (!process.env.INTEGRATION_TEST) {
  // Mock out Prisma Client for tests
  jest.mock("@prisma/client", () => ({
    PrismaClient: function () {
      return mockDeep<OriginalPrismaClient>();
    },
  }));
}

// Add globals to be able to access Request/Response etc. in the tests
installGlobals();
