import Backend from "i18next-fs-backend";
import { resolve } from "node:path";
import { RemixI18Next } from "remix-i18next";
import env from "~/env";

export const i18nFilenameSuffix =
  env.NODE_ENV === "production" && env.APP_VERSION ? `-${env.APP_VERSION}` : "";

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
