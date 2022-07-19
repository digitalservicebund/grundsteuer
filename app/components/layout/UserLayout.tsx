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
  showNewIdent?: boolean;
}) {
  return (
    <Layout
      footer={<Footer />}
      sidebarNavigation={
        <SidebarNavigation
          actions={
            <NavigationActions
              userIsIdentified={props.userIsIdentified}
              showNewIdent={props.showNewIdent}
            />
          }
        />
      }
      topNavigation={
        <TopNavigation
          actions={
            <NavigationActions
              userIsIdentified={props.userIsIdentified}
              showNewIdent={props.showNewIdent}
            />
          }
        />
      }
    >
      <Main>{props.children}</Main>
    </Layout>
  );
}
