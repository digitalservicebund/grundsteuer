import { FileSystemBackend, RemixI18Next } from "remix-i18next";

const backend = new FileSystemBackend("./app/i18n");

export const i18Next = new RemixI18Next(backend, {
  fallbackLng: "de",
  supportedLanguages: ["de"],
  i18nextOptions: { returnObjects: true },
});
