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
} from "remix";
import { i18Next } from "~/i18n.server";
import { useSetupTranslations } from "remix-i18next";
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
  return { title: "Grundsteuererklärung für Privateigentum" };
};

export const loader: LoaderFunction = async ({ request }) => {
  return {
    i18n: await i18Next.getTranslations(request, ["all"]),
  };
};

export default function App() {
  useSetupTranslations("de");

  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        <title>Grundsteuererklärung für Privateigentum</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col min-h-screen bg-gray-100 text-black">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
