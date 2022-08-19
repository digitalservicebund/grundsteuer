import Backend from "i18next-fs-backend";
import { resolve } from "node:path";
import { RemixI18Next } from "remix-i18next";

const i18nFilenameSuffix =
  process.env.NODE_ENV === "production" ? `-${process.env.APP_VERSION}` : "";

export const i18Next = new RemixI18Next({
  detection: {
    supportedLanguages: ["de"],
    fallbackLanguage: "de",
  },
  i18next: {
    backend: {
      loadPath: resolve(
        `./public/locales/{{lng}}/{{ns}}${i18nFilenameSuffix}.json`
      ),
    },
    returnObjects: true,
  },
  backend: Backend,
});
