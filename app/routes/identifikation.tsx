import { UserLayout } from "~/components";
import { MetaFunction } from "@remix-run/node";
import { pageTitle } from "~/util/pageTitle";
import { Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Identifikation") };
};

export default function Identifikation() {
  return (
    <UserLayout>
      <Outlet />
    </UserLayout>
  );
}
