import { LoaderFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { getStoredFormData } from "~/formDataStorage.server";
import {
  Button,
  Footer,
  FormSidebarNavigation,
  SidebarNavigation,
  Layout,
  LogoutButton,
} from "~/components";
import { createGraph } from "~/domain";
import { getCurrentStateFromUrl } from "~/util/getCurrentState";
import { authenticator } from "~/auth.server";
import { useState } from "react";
import DriveFileRenameOutlineIcon from "~/components/icons/mui/DriveFileRenameOutline";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  const storedFormData = await getStoredFormData({ request, user });

  const graph = createGraph({
    machineContext: storedFormData,
  });

  return {
    graph,
    currentState: getCurrentStateFromUrl(request.url),
    userIsIdentified: user.identified,
  };
};

export default function Formular() {
  const { graph, currentState, userIsIdentified } = useLoaderData();

  const [showMobileNavigation, setShowMobileNavigation] = useState(false);

  function FscButton() {
    if (userIsIdentified) return null;

    return (
      <Button
        size="small"
        look="ghost"
        to="/fsc"
        icon={<DriveFileRenameOutlineIcon />}
      >
        Freischaltcode
      </Button>
    );
  }

  return (
    <Layout
      footer={<Footer />}
      sidebarNavigation={
        <SidebarNavigation>
          <LogoutButton />
          <FscButton />
          <br />
          <br />
          <FormSidebarNavigation
            graph={graph}
            initialCurrentState={currentState}
          />
        </SidebarNavigation>
      }
      topNavigation={
        <div className="p-4 bg-blue-100">
          <Link to="/">Home</Link>
          <LogoutButton />
          <FscButton />
          <Button
            size="small"
            look="tertiary"
            onClick={() => setShowMobileNavigation(!showMobileNavigation)}
          >
            Toggle Navigation
          </Button>
          {showMobileNavigation && (
            <>
              <br />

              <br />
              <FormSidebarNavigation
                graph={graph}
                initialCurrentState={currentState}
              />
            </>
          )}
        </div>
      }
    >
      <div className="h-full md:pl-16">
        <Outlet />
      </div>
    </Layout>
  );
}
