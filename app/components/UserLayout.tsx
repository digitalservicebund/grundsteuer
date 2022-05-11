import { ReactNode } from "react";
import { Footer, Layout, Main, SidebarNavigation } from "~/components";

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
          userIsLoggedIn={props.userIsLoggedIn}
          userIsIdentified={props.userIsIdentified}
        />
      }
      topNavigation={<div></div>}
    >
      <Main>{props.children}</Main>
    </Layout>
  );
}
