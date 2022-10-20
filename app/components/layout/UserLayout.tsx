import { ReactNode } from "react";
import {
  Footer,
  Layout,
  Main,
  NavigationActions,
  SidebarNavigation,
  TopNavigation,
} from "~/components";
import LogoutMenu from "~/components/navigation/LogoutMenu";
import { Flags } from "~/flags.server";

export default function UserLayout(props: {
  children: ReactNode;
  path?: string;
  flags?: Flags;
}) {
  return (
    <Layout
      footer={<Footer />}
      sidebarNavigation={<SidebarNavigation actions={<NavigationActions />} />}
      topNavigation={<TopNavigation actions={<NavigationActions />} />}
      logoutMenu={
        <LogoutMenu
          containerClasses="flex flex-col items-center"
          statusClasses="mb-8"
        />
      }
      flags={props.flags}
      path={props.path}
    >
      <Main>{props.children}</Main>
    </Layout>
  );
}
