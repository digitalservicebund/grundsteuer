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
import { useRemixI18Next } from "remix-i18next";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: "/tailwind.css" }];
};

export const meta: MetaFunction = () => {
  return { title: "Grundsteuererklärung für Privateigentum" };
};

export default function App() {
  useRemixI18Next("de");

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
