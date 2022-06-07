import { RemixBrowser } from "@remix-run/react";
import i18next from "i18next";
import Backend from "i18next-http-backend";
import { hydrate } from "react-dom";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { getInitialNamespaces } from "remix-i18next";
import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";

declare global {
  interface Window {
    sentry_dsn: string | undefined;
  }
}

Sentry.init({
  dsn: window.sentry_dsn,
  tracesSampleRate: 1.0,
  integrations: [new Integrations.BrowserTracing()],
});

i18next
  .use(initReactI18next)
  .use(Backend)
  .init({
    supportedLngs: ["de"],
    defaultNS: "all",
    fallbackLng: "de",
    react: { useSuspense: false },
    ns: getInitialNamespaces(),
    backend: { loadPath: "/locales/de/{{ns}}.json" },
    detection: {
      order: ["htmlTag"],
      caches: [],
    },
  })
  .then(() => {
    return hydrate(
      <I18nextProvider i18n={i18next}>
        <RemixBrowser />
      </I18nextProvider>,
      document
    );
  });
