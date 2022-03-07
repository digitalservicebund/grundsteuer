import {
  Links,
  LinksFunction,
  LiveReload,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";
import { useSetupTranslations } from "remix-i18next";
import styles from "public/tailwind.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const meta: MetaFunction = () => {
  return { title: "Grundsteuererklärung für Privateigentum" };
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
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
