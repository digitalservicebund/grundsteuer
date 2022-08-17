import {
  json,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { useChangeLanguage } from "remix-i18next";
import { pageTitle } from "~/util/pageTitle";
import styles from "public/tailwind.css";
import ogImage from "~/assets/images/og-image.png";
import { ErrorPage } from "~/components";
import { withSentry } from "@sentry/remix";
import { testFeaturesEnabled } from "~/util/testFeaturesEnabled";

export const links: LinksFunction = () => {
  return [
    {
      rel: "preload",
      as: "font",
      href: "/fonts/BundesSansWeb-Regular.woff2",
      type: "font/woff2",
      crossOrigin: "anonymous",
    },
    {
      rel: "preload",
      as: "font",
      href: "/fonts/BundesSansWeb-Bold.woff2",
      type: "font/woff2",
      crossOrigin: "anonymous",
    },
    { rel: "stylesheet", href: styles },
    { rel: "icon", sizes: "any", href: "/favicon.ico" },
    { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    { rel: "manifest", href: "/site.webmanifest" },
  ];
};

export const meta: MetaFunction = () => {
  const title = pageTitle(null);
  const description =
    "Mit dem Online-Service, entwickelt im Auftrag des Bundesfinanzministeriums, können Privateigentümer:innen ihre Grundsteuererklärung einfach und kostenlos abgeben.";
  return {
    title,
    description,
    viewport: "width=device-width,initial-scale=1",
    "og:image": `https://www.grundsteuererklaerung-fuer-privateigentum.de${ogImage}`,
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:site_name":
      "Grundsteuererklärung für Privateigentum. Schnell. Unkompliziert. Kostenlos.",
    "twitter:title": title,
    "twitter:description": description,
    "twitter:card": "summary_large_image",
    "twitter:site": "@DigitalServ4Ger",
  };
};

export interface RootLoaderData {
  env: string;
  sentryDsn: string;
  version: string;
  showTestFeatures: boolean;
}

export const loader: LoaderFunction = async () => {
  return json<RootLoaderData>({
    env: process.env.APP_ENV as string,
    sentryDsn: process.env.SENTRY_DSN as string,
    version: process.env.APP_VERSION as string,
    showTestFeatures: testFeaturesEnabled(),
  });
};

export const handle = {
  i18n: ["all"],
};

export function ErrorBoundary({ error }: { error: Error }) {
  if (typeof document === "undefined") {
    // log only in server, never in browser
    console.error(error);
  }
  return (
    <html lang="de">
      <head>
        <title>{pageTitle("Ein unerwarteter Fehler ist aufgetreten")}</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Links />
      </head>
      <body className="flex flex-col min-h-screen text-black bg-gray-100 leading-default">
        <ErrorPage statusCode={500} />
        <Scripts />
      </body>
    </html>
  );
}

export function CatchBoundary() {
  return (
    <html lang="de">
      <head>
        <title>{pageTitle("Seite konnte nicht gefunden werden")}</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Links />
      </head>
      <body>
        <ErrorPage statusCode={404} />
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `window.plausible && window.plausible("404",{ props: { path: document.location.pathname } });`,
          }}
        />
      </body>
    </html>
  );
}

function App() {
  const { env, sentryDsn, version } = useLoaderData();
  useChangeLanguage("de");

  const location = useLocation();
  const [pathname, setPathname] = useState(location.pathname);

  useEffect(() => {
    if (pathname !== location.pathname && !location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
    setPathname(location.pathname);
  }, [location]);

  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col min-h-screen text-black bg-gray-100 leading-default">
        <Outlet />
        {sentryDsn && (
          <script
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html: `window.SENTRY_DSN="${sentryDsn}"; window.APP_ENV="${env}"; window.APP_VERSION="${version}";`,
            }}
          />
        )}
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default withSentry(App);
