import { LoaderFunction, Outlet, Link, useLoaderData } from "remix";
import {
  Footer,
  Layout,
} from "@digitalservice4germany/digital-service-library";
import { i18Next } from "~/i18n.server";
import { getFormDataCookie } from "~/cookies";
import SidebarNavigation from "~/components/SidebarNavigation";
import { createGraph } from "~/domain";

// DUPLICATED TODO -> create util folder?
const getCurrentState = (request: Request) => {
  return new URL(request.url).pathname
    .split("/")
    .filter((e) => e && e !== "formular")
    .join(".");
};

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = await getFormDataCookie(request);

  const graph = createGraph({
    machineContext: cookie.records,
  });

  return {
    i18n: await i18Next.getTranslations(request, ["all"]),
    graph,
    currentState: getCurrentState(request),
  };
};

export default function Formular() {
  const { graph, currentState } = useLoaderData();
  return (
    <Layout
      footer={<Footer> Footer </Footer>}
      sidebarNavigation={
        <div className="p-2">
          <Link to="/">Home</Link>
          <br />
          <br />
          <SidebarNavigation graph={graph} currentState={currentState} />
        </div>
      }
      topNavigation={
        <div className="p-4 bg-blue-100">
          <Link to="/">Home</Link>
          <br />
          <br />
          <SidebarNavigation graph={graph} currentState={currentState} />
        </div>
      }
    >
      <div className="max-w-screen-md mx-auto p-16">
        <Outlet />
      </div>
    </Layout>
  );
}
