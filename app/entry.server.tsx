import { createInstance } from "i18next";
import { EntryContext } from "@remix-run/node";
import { i18Next } from "~/i18n.server";
import { I18nextProvider, initReactI18next } from "react-i18next";
import Backend from "i18next-fs-backend";
import { renderToString } from "react-dom/server";
import { RemixServer } from "@remix-run/react";
import { resolve } from "node:path";

export default async function handleRequest(
  request: Request,
  statusCode: number,
  headers: Headers,
  context: EntryContext
) {
  const instance = createInstance();

  const ns = i18Next.getRouteNamespaces(context);

  await instance
    .use(initReactI18next)
    .use(Backend)
    .init({
      supportedLngs: ["de"],
      defaultNS: "all",
      fallbackLng: "de",
      react: { useSuspense: false },
      ns,
      backend: {
        loadPath: resolve("./public/locales/de/{{ns}}.json"),
      },
    });

  const markup = renderToString(
    <I18nextProvider i18n={instance}>
      <RemixServer context={context} url={request.url} />
    </I18nextProvider>
  );

  headers.set("Content-Type", "text/html");

  return new Response("<!DOCTYPE html>" + markup, {
    status: statusCode,
    headers: headers,
  });
}
