import { LoaderFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { Layout } from "@digitalservice4germany/digital-service-library";
import { getStoredFormData } from "~/formDataStorage.server";
import {
  Button,
  Footer,
  FormSidebarNavigation,
  LogoutButton,
} from "~/components";
import { createGraph } from "~/domain";
import { getCurrentStateFromUrl } from "~/util/getCurrentState";
import { authenticator } from "~/auth.server";
import { useState } from "react";

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
  };
};

export default function Formular() {
  const { graph, currentState } = useLoaderData();

  const [showMobileNavigation, setShowMobileNavigation] = useState(false);

  return (
    <Layout
      footer={<Footer />}
      sidebarNavigation={
        <div className="p-2">
          <Link to="/">Home</Link>
          <LogoutButton />
          <br />
          <br />
          <FormSidebarNavigation
            graph={graph}
            initialCurrentState={currentState}
          />
        </div>
      }
      topNavigation={
        <div className="p-4 bg-blue-100">
          <Link to="/">Home</Link>
          <LogoutButton />
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
