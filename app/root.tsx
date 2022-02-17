import {
  json,
  Link,
  Links,
  LinksFunction,
  LiveReload,
  LoaderFunction,
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
import { i18n } from "~/i18n.server";
import { useTranslation } from "react-i18next";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: "/tailwind.css" }];
};

export const meta: MetaFunction = () => {
  return { title: "New Remix App" };
};

export type Handle = {
  showFormNavigation: boolean;
};

type MatchingRoute = {
  id: string;
  pathname: string;
  params: import("react-router").Params;
  data: RouteData;
  handle: Handle;
};

function getNavigationLink(
  href: string,
  matchingUrl: string,
  label: string,
  showFormNavigation: MatchingRoute
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

export const loader: LoaderFunction = async ({ request }) => {
  return json({
    i18n: await i18n.getTranslations(request, ["common"]),
  });
};

export default function App() {
  const matches = useMatches();
  useRemixI18Next("de");
  const { t } = useTranslation("common");

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
                  t("nav.eigentuemer"),
                  showFormNavigation
                )}
                <br />
                {getNavigationLink(
                  "/steps/grundstueck",
                  "/steps/grundstueck",
                  t("nav.grundstueck"),
                  showFormNavigation
                )}
                <br />
                {getNavigationLink(
                  "/steps/gebaeude",
                  "/steps/gebaeude",
                  t("nav.gebaeude"),
                  showFormNavigation
                )}
                <br />
                {getNavigationLink(
                  "/steps/zusammenfassung",
                  "/steps/zusammenfassung",
                  t("nav.zusammenfassung"),
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
