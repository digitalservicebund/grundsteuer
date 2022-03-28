import { LoaderFunction, Outlet, Link, useLoaderData } from "remix";
import { Layout } from "@digitalservice4germany/digital-service-library";
import { getFormDataCookie } from "~/cookies";
import { Footer, SidebarNavigation, LogoutButton } from "~/components";
import { createGraph } from "~/domain";
import { getCurrentStateFromUrl } from "~/util/getCurrentState";
// import { authenticator } from "~/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  // const user = await authenticator.isAuthenticated(request, {
  //   failureRedirect: "/anmelden",
  // });
  // console.log({ user });

  const cookie = await getFormDataCookie(request);

  const graph = createGraph({
    machineContext: cookie.records,
  });

  return {
    graph,
    currentState: getCurrentStateFromUrl(request.url),
  };
};

export default function Formular() {
  const { graph, currentState } = useLoaderData();
  return (
    <Layout
      footer={<Footer />}
      sidebarNavigation={
        <div className="p-2">
          <Link to="/">Home</Link>
          <LogoutButton />
          <br />
          <br />
          <SidebarNavigation graph={graph} initialCurrentState={currentState} />
        </div>
      }
      topNavigation={
        <div className="p-4 bg-blue-100">
          <Link to="/">Home</Link>
          <LogoutButton />
          <br />
          <br />
          <SidebarNavigation graph={graph} initialCurrentState={currentState} />
        </div>
      }
    >
      <div className="md:pl-16 h-full">
        <Outlet />
      </div>
    </Layout>
  );
}
