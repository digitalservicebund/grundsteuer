import { LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { getStoredFormData } from "~/formDataStorage.server";
import {
  Footer,
  FormSidebarNavigation,
  Layout,
  Main,
  NavigationActions,
  SidebarNavigation,
  TopNavigation,
} from "~/components";
import { createFormGraph } from "~/domain";
import { getCurrentStateFromUrl } from "~/util/getCurrentState";
import { authenticator } from "~/auth.server";
import LogoutMenu from "~/components/navigation/LogoutMenu";
import { testFeaturesEnabled } from "~/util/testFeaturesEnabled";
import { flags } from "~/flags.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  const storedFormData = await getStoredFormData({ request, user });

  const graph = createFormGraph({
    machineContext: {
      ...storedFormData,
      testFeaturesEnabled: testFeaturesEnabled(),
    },
  });

  return {
    email: user.email,
    graph,
    currentState: getCurrentStateFromUrl(request.url),
    userHasFinishedProcess: !user.inDeclarationProcess,
    flags: flags.getAllFlags(),
  };
};

export default function Formular() {
  const { email, graph, currentState, userHasFinishedProcess, flags } =
    useLoaderData();

  const location = useLocation();

  return (
    <Layout
      footer={<Footer />}
      sidebarNavigation={
        <SidebarNavigation
          actions={
            <NavigationActions
              email={email}
              newDeclarationLink={userHasFinishedProcess}
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
              email={email}
              newDeclarationLink={userHasFinishedProcess}
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
      logoutMenu={
        <LogoutMenu
          email={email}
          containerClasses="flex flex-col items-end"
          statusClasses="mb-8"
        />
      }
      flags={flags}
      path={location.pathname}
    >
      <Main>
        <Outlet />
      </Main>
    </Layout>
  );
}
