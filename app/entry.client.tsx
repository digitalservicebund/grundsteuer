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
    SENTRY_DSN: string | undefined;
    APP_ENV: string | undefined;
    APP_VERSION: string | undefined;
  }
}

Sentry.init({
  dsn: window.SENTRY_DSN,
  // tracesSampleRate: 0.05,
  environment: window.APP_ENV,
  release: window.APP_VERSION,
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
