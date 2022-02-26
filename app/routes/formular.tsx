import { json, LoaderFunction, Outlet, useLoaderData, useMatches } from "remix";
import {
  Footer,
  Layout,
} from "@digitalservice4germany/digital-service-library";
import { i18Next } from "~/i18n.server";
import { getFormDataCookie } from "~/cookies";
import SidebarNavigation from "~/components/SidebarNavigation";

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = await getFormDataCookie(request);
  return json({
    data: cookie.records,
    i18n: await i18Next.getTranslations(request, ["common"]),
  });
};

export default function Formular() {
  const matchingRoutes = useMatches();
  const data = useLoaderData().data;
  return (
    <Layout
      footer={<Footer> Footer </Footer>}
      sidebarNavigation={
        <SidebarNavigation matchingRoutes={matchingRoutes} data={data} />
      }
      topNavigation={
        <div className="p-4 bg-blue-300">
          <SidebarNavigation matchingRoutes={matchingRoutes} data={data} />
        </div>
      }
    >
      <div className="max-w-screen-md mx-auto p-16">
        <Outlet />
      </div>
    </Layout>
  );
}
