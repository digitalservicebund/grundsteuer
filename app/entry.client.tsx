import { RemixBrowser, useLocation, useMatches } from "@remix-run/react";
import { useEffect } from "react";
import i18next from "i18next";
import Backend from "i18next-http-backend";
import { hydrate } from "react-dom";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { getInitialNamespaces } from "remix-i18next";
import * as Sentry from "@sentry/remix";
import Plausible, { EventOptions, PlausibleOptions } from "plausible-tracker";

declare global {
  interface Window {
    SENTRY_DSN: string | undefined;
    APP_ENV: string | undefined;
    APP_VERSION: string | undefined;
  }
}

Sentry.init({
  dsn: window.SENTRY_DSN,
  environment: window.APP_ENV,
  release: window.APP_VERSION,
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.remixRouterInstrumentation(
        useEffect,
        useLocation,
        useMatches
      ),
    }),
  ],
});

const i18nFilename =
  process.env.NODE_ENV === "production" && window.APP_VERSION
    ? `-${window.APP_VERSION}`
    : "";
i18next
  .use(initReactI18next)
  .use(Backend)
  .init({
    supportedLngs: ["de"],
    defaultNS: "all",
    fallbackLng: "de",
    react: { useSuspense: false },
    ns: getInitialNamespaces(),
    backend: { loadPath: `/locales/de/{{ns}}${i18nFilename}.json` },
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

/* Remix frontend router utilizes pushState AND replaceState => the default
 * single-page application support of Plausible does not work for us, as it
 * only takes pushState into account => we need to implement our own pageview
 * tracking.
 * The implementation is very close to the default implementation. We only add
 * the handling for replaceState calls.
 * Old: Regular links cause a pushState call ("cool"). Form submits cause a
 * pushState call with the current page ("wrong", but harmless because filtered
 * out) and a replaceState call with the new page after the redirect ("missed").
 */
type TrackPageview = (
  eventData?: PlausibleOptions,
  options?: EventOptions
) => void;
let trackPageview: TrackPageview;

if (
  window.location.host === "www.grundsteuererklaerung-fuer-privateigentum.de"
) {
  // use real track function in production
  const plausible = Plausible({
    domain: "grundsteuererklaerung-fuer-privateigentum.de",
  });
  trackPageview = plausible.trackPageview;
} else {
  // use dummy function that logs to browser console
  trackPageview = () => {
    console.log(
      "[plausible] would have tracked pageview:",
      window.location.pathname
    );
  };
}

let formerPathname = window.location.pathname;

function trackPageViewWhenNewPage() {
  const currentPathname = window.location.pathname;
  if (currentPathname === formerPathname) return;
  formerPathname = currentPathname;
  trackPageview();
}

const originalPushState = window.history && window.history.pushState;
if (originalPushState) {
  window.history.pushState = function () {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    // eslint-disable-next-line prefer-rest-params
    originalPushState.apply(this, arguments);
    // track regular pageviews caused by pushState call
    trackPageViewWhenNewPage();
  };
  // track pageviews when using back/forward browser buttons
  window.addEventListener("popstate", trackPageViewWhenNewPage);
}

// basically this is the only addition:
const originalReplaceState = window.history && window.history.replaceState;
if (originalReplaceState) {
  window.history.replaceState = function () {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    // eslint-disable-next-line prefer-rest-params
    originalReplaceState.apply(this, arguments);
    // track pageviews after redirect (e.g. success page after form submit)
    // eslint-disable-next-line prefer-rest-params
    if (arguments[0] && arguments[0].usr && arguments[0].usr.isRedirect) {
      trackPageViewWhenNewPage();
    }
  };
}

// track the very first pageview
trackPageview();
