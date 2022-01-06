import type { LinksFunction } from "remix";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";
import type { MetaFunction } from "remix";
import {
  Layout,
  Footer,
} from "@digitalservice4germany/digital-service-library";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: "/tailwind.css" }];
};

export const meta: MetaFunction = () => {
  return { title: "New Remix App" };
};

export default function App() {
  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        <title>Grundsteuer</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Layout
          footer={<Footer> Footer </Footer>}
          sidebarNavigation={
            <div className="h-full p-4 bg-white">
              <ul>
                <li>Übersicht</li>
              </ul>
            </div>
          }
          topNavigation={
            <div className="p-4 bg-blue-300">
              topNavigation (hidden on larger screens)
            </div>
          }
        >
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
