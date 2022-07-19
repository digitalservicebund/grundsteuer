import { Outlet, useLoaderData } from "@remix-run/react";
import { UserLayout } from "~/components";
import { LoaderFunction } from "@remix-run/node";
import { testFeaturesEnabled } from "~/util/testFeaturesEnabled";

export const loader: LoaderFunction = async () => {
  if (!testFeaturesEnabled) {
    throw new Response("Not Found", {
      status: 404,
    });
  }
  return { showNewIdent: testFeaturesEnabled };
};

export default function Ekona() {
  const { showNewIdent } = useLoaderData();
  return (
    <UserLayout showNewIdent={showNewIdent}>
      <Outlet />
    </UserLayout>
  );
}
