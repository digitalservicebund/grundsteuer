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
  return {
    title: pageTitle(null),
    description:
      "Mit dem Online-Service, entwickelt im Auftrag des Bundesfinanzministerium, können Privateigentümer:innen von Einfamilienhäusern, Zweifamilienhäusern, Eigentumswohnungen und unbebauten Grundstücken ihre Grundsteuererklärung einfach und kostenlos abgeben.",
    viewport: "width=device-width,initial-scale=1",
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
