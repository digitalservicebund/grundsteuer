import { LoaderFunction, redirect } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { getStoredFormData } from "~/storage/formDataStorage.server";
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
import { authenticator, SessionUser } from "~/auth.server";
import LogoutMenu from "~/components/navigation/LogoutMenu";
import { testFeaturesEnabled } from "~/util/testFeaturesEnabled";
import { flags } from "~/flags.server";
import { findUserByEmail, User } from "~/domain/user";

const userIsSendingDeclaration = async (user: SessionUser) => {
  if (user) {
    const userData: User | null = await findUserByEmail(user.email);
    return userData && userData.ericaRequestIdSenden;
  }
  return false;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  if (
    (await userIsSendingDeclaration(user)) &&
    !request.url.includes("/formular/zusammenfassung")
  ) {
    return redirect("/formular/zusammenfassung");
  }
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
              appLinks
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
              appLinks
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
