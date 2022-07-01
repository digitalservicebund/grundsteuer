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
  userIsLoggedIn?: boolean;
  userIsIdentified?: boolean;
}) {
  return (
    <Layout
      footer={<Footer />}
      sidebarNavigation={
        <SidebarNavigation
          actions={
            <NavigationActions
              userIsIdentified={props.userIsIdentified}
              userIsLoggedIn={props.userIsLoggedIn}
            />
          }
        />
      }
      topNavigation={
        <TopNavigation
          actions={
            <NavigationActions
              userIsIdentified={props.userIsIdentified}
              userIsLoggedIn={props.userIsLoggedIn}
            />
          }
        />
      }
    >
      <Main>{props.children}</Main>
    </Layout>
  );
}
