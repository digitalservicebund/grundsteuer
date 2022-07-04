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
  ContentContainer,
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
              userIsLoggedIn={true}
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
              userIsLoggedIn={true}
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
      <div className="flex-shrink-0 bg-yellow-300 border-l-[9px] border-l-yellow-500 py-16 lg:py-28">
        <ContentContainer>
          <div className="text-20 leading-26 lg:leading-40">
            Wichtig! Aktuell gibt es Probleme bei der Interaktion mit ELSTER.
            Sie könnten daher mehr Fehler bekommen, wir bitten um
            Entschuldigung. Wir arbeiten daran das Problem zu beheben.
          </div>
        </ContentContainer>
      </div>
      <Main>
        <Outlet />
      </Main>
    </Layout>
  );
}
