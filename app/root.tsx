import {
  Link,
  Links,
  LinksFunction,
  LiveReload,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useMatches,
} from "remix";
import {
  Footer,
  Layout,
} from "@digitalservice4germany/digital-service-library";
import { useRemixI18Next } from "remix-i18next";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: "/tailwind.css" }];
};

export const meta: MetaFunction = () => {
  return { title: "New Remix App" };
};

export default function App() {
  const matches = useMatches();
  useRemixI18Next("de");

  const showFormNavigation = matches.find(
    (match) => match.handle?.showFormNavigation
  );

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
            showFormNavigation ? (
              <div>
                <Link to="/steps/eigentuemer/anzahl">Eigentümer:innen</Link>
                <br />
                <Link to="/steps/grundstueck">Grundstück</Link>
                <br />
                <Link to="/steps/zusammenfassung">Zusammenfassung</Link>
              </div>
            ) : (
              <div className="h-full p-4 bg-white">
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                </ul>
              </div>
            )
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
