import {
  Links,
  LinksFunction,
  LiveReload,
  LoaderFunction,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "remix";
import { i18Next } from "~/i18n.server";
import { useSetupTranslations } from "remix-i18next";
import { pageTitle } from "~/util/pageTitle";
import styles from "public/tailwind.css";
import ogImage from "~/assets/images/og-image.png";

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
  ];
};

export const meta: MetaFunction = () => {
  const title = pageTitle(null);
  const description =
    "Mit dem Online-Service, entwickelt im Auftrag des Bundesfinanzministeriums, können Privateigentümer:innen von Einfamilienhäusern, Zweifamilienhäusern, Eigentumswohnungen und unbebauten Grundstücken ihre Grundsteuererklärung einfach und kostenlos abgeben.";
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

export const loader: LoaderFunction = async ({ request }) => {
  return {
    i18n: await i18Next.getTranslations(request, ["all"]),
    env: process.env.APP_ENV,
  };
};

export default function App() {
  const { env } = useLoaderData();
  useSetupTranslations("de");

  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
        {env === "production" && (
          <script
            defer
            data-domain="grundsteuererklaerung-fuer-privateigentum.de"
            src="https://plausible.io/js/plausible.js"
          ></script>
        )}
      </head>
      <body className="flex flex-col min-h-screen bg-gray-100 text-black leading-default">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
