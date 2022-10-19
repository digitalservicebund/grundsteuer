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
import { Banners } from "~/components/layout/Layout";

export default function UserLayout(props: {
  children: ReactNode;
  banners?: Banners;
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
      banners={props.banners}
    >
      <Main>{props.children}</Main>
    </Layout>
  );
}
