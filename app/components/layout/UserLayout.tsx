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
  email: string;
  path?: string;
  flags?: Flags;
  useUseid?: boolean;
  isMobile?: boolean;
}) {
  return (
    <Layout
      footer={<Footer />}
      sidebarNavigation={
        <SidebarNavigation
          actions={<NavigationActions email={props.email} />}
        />
      }
      topNavigation={
        <TopNavigation actions={<NavigationActions email={props.email} />} />
      }
      logoutMenu={
        <LogoutMenu
          email={props.email}
          containerClasses="flex flex-col items-end"
          statusClasses="mb-8"
        />
      }
      flags={props.flags}
      path={props.path}
      useUseid={props.useUseid}
      isMobile={props.isMobile}
    >
      <Main>{props.children}</Main>
    </Layout>
  );
}
