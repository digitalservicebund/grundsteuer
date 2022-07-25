import { Outlet } from "@remix-run/react";
import { UserLayout } from "~/components";
import { LoaderFunction } from "@remix-run/node";
import { testFeaturesEnabled } from "~/util/testFeaturesEnabled";

export const loader: LoaderFunction = async () => {
  if (!testFeaturesEnabled) {
    throw new Response("Not Found", {
      status: 404,
    });
  }
  return {};
};

export default function Ekona() {
  return (
    <UserLayout>
      <Outlet />
    </UserLayout>
  );
}
