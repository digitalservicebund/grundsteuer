import { ReactNode } from "react";
import {
  Footer,
  Layout,
  Main,
  SidebarNavigation,
  TopNavigation,
  NavigationActions,
} from "~/components";

export default function UserLayout(props: {
  children: ReactNode;
  userIsIdentified?: boolean;
}) {
  return (
    <Layout
      footer={<Footer />}
      sidebarNavigation={
        <SidebarNavigation
          actions={
            <NavigationActions userIsIdentified={props.userIsIdentified} />
          }
        />
      }
      topNavigation={
        <TopNavigation
          actions={
            <NavigationActions userIsIdentified={props.userIsIdentified} />
          }
        />
      }
    >
      <Main>{props.children}</Main>
    </Layout>
  );
}
