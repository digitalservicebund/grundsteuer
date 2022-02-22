import {
  json,
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
  useMatches,
} from "remix";
import {
  Footer,
  Layout,
} from "@digitalservice4germany/digital-service-library";
import { useRemixI18Next } from "remix-i18next";
import { i18n } from "~/i18n.server";
import { getFormDataCookie } from "~/cookies";
import { defaults } from "~/domain/model";
import SidebarNavigation from "~/components/SidebarNavigation";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: "/tailwind.css" }];
};

export const meta: MetaFunction = () => {
  return { title: "New Remix App" };
};

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = await getFormDataCookie(request);
  return json({
    data: Object.keys(cookie).length < 1 ? defaults : cookie.records,
    i18n: await i18n.getTranslations(request, ["common"]),
  });
};

export default function App() {
  const matchingRoutes = useMatches();
  const data = useLoaderData().data;
  useRemixI18Next("de");

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
            <SidebarNavigation matchingRoutes={matchingRoutes} data={data} />
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
        <LiveReload />
      </body>
    </html>
  );
}
