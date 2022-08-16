import { ReactNode } from "react";
import {
  Footer,
  Layout,
  Main,
  SidebarNavigation,
  TopNavigation,
  NavigationActions,
} from "~/components";
import LogoutMenu from "~/components/navigation/LogoutMenu";

export default function UserLayout(props: { children: ReactNode }) {
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
    >
      <Main>{props.children}</Main>
    </Layout>
  );
}
