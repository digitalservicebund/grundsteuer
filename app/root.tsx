import {
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
  useLoaderData,
  useMatches,
} from "remix";
import {
  Footer,
  Layout,
} from "@digitalservice4germany/digital-service-library";
import { stepNavigation } from "~/domain/stepNavigation";
import { FormNavigation } from "~/components/FormNavigation";
import { getFormDataCookie } from "~/cookies";
import { useRemixI18Next } from "remix-i18next";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: "/tailwind.css" }];
};

export const meta: MetaFunction = () => {
  return { title: "New Remix App" };
};

export const loader: LoaderFunction = async ({ request }) => {
  console.log("APP loader");

  const cookie = await getFormDataCookie(request);
  return { records: cookie.records };
};

export default function App() {
  const matches = useMatches();
  const { records } = useLoaderData();
  useRemixI18Next("de");

  const showFormNavigationData = matches.find(
    (match) => match.handle?.showFormNavigation
  )?.data;

  let formNavigationData;
  if (showFormNavigationData) {
    console.log({ showFormNavigationData });
    // formNavigationData = new Formular().navigationData();
    formNavigationData = stepNavigation(records);
  }

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
            formNavigationData ? (
              <div>
                <FormNavigation data={formNavigationData} />
                <pre className="text-xs">
                  {JSON.stringify({ showFormNavigationData }, null, 2)}
                </pre>
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
