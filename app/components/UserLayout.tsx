import { ReactNode } from "react";
import { Footer, Layout, Main, SidebarNavigation } from "~/components";

export default function UserLayout(props: { children: ReactNode }) {
  return (
    <Layout
      footer={<Footer />}
      sidebarNavigation={<SidebarNavigation></SidebarNavigation>}
      topNavigation={<div></div>}
    >
      <Main>{props.children}</Main>
    </Layout>
  );
}
