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
import classNames from "classnames";
import { RouteData } from "@remix-run/react/routeData";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: "/tailwind.css" }];
};

export const meta: MetaFunction = () => {
  return { title: "New Remix App" };
};

function getNavigationLink(
  href: string,
  matchingUrl: string,
  label: string,
  showFormNavigation: {
    id: string;
    pathname: string;
    params: import("react-router").Params<string>;
    data: RouteData;
    handle: any;
  }
) {
  return (
    <Link
      to={href}
      className={classNames({
        "font-bold": showFormNavigation.pathname.includes(matchingUrl),
      })}
    >
      {label}
    </Link>
  );
}

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
                {getNavigationLink(
                  "/steps/eigentuemer/anzahl",
                  "/steps/eigentuemer",
                  "Eigentümer:innen",
                  showFormNavigation
                )}
                <br />
                {getNavigationLink(
                  "/steps/grundstueck",
                  "/steps/grundstueck",
                  "Grundstück",
                  showFormNavigation
                )}
                <br />
                {getNavigationLink(
                  "/steps/gebaeude",
                  "/steps/gebaeude",
                  "Gebäude",
                  showFormNavigation
                )}
                <br />
                {getNavigationLink(
                  "/steps/zusammenfassung",
                  "/steps/zusammenfassung",
                  "Zusammenfassung",
                  showFormNavigation
                )}
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
