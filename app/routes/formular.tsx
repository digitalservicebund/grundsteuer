import { LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { getStoredFormData } from "~/formDataStorage.server";
import {
  Footer,
  FormSidebarNavigation,
  SidebarNavigation,
  Layout,
  Main,
  NavigationActions,
  TopNavigation,
} from "~/components";
import { createFormGraph } from "~/domain";
import { getCurrentStateFromUrl } from "~/util/getCurrentState";
import { authenticator } from "~/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  const storedFormData = await getStoredFormData({ request, user });

  const graph = createFormGraph({
    machineContext: storedFormData,
  });

  return {
    graph,
    currentState: getCurrentStateFromUrl(request.url),
    userIsIdentified: user.identified,
    userHasFinishedProcess: !user.inDeclarationProcess,
  };
};

export default function Formular() {
  const { graph, currentState, userIsIdentified, userHasFinishedProcess } =
    useLoaderData();

  return (
    <Layout
      footer={<Footer />}
      sidebarNavigation={
        <SidebarNavigation
          actions={
            <NavigationActions
              userIsIdentified={userIsIdentified}
              userHasFinishedProcess={userHasFinishedProcess}
            />
          }
        >
          {!userHasFinishedProcess && (
            <FormSidebarNavigation
              graph={graph}
              initialCurrentState={currentState}
            />
          )}
        </SidebarNavigation>
      }
      topNavigation={
        <TopNavigation
          actions={
            <NavigationActions
              userIsIdentified={userIsIdentified}
              userHasFinishedProcess={userHasFinishedProcess}
            />
          }
        >
          {!userHasFinishedProcess && (
            <FormSidebarNavigation
              graph={graph}
              initialCurrentState={currentState}
            />
          )}
        </TopNavigation>
      }
    >
      <Main>
        <Outlet />
      </Main>
    </Layout>
  );
}
