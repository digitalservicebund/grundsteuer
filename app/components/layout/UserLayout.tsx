import { ReactNode } from "react";
import {
  Footer,
  Layout,
  Main,
  SidebarNavigation,
  TopNavigation,
  NavigationActions,
  ContentContainer,
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
      <div className="flex-shrink-0 bg-yellow-300 border-l-[9px] border-l-yellow-500 py-16 lg:py-28">
        <ContentContainer>
          <div className="text-20 leading-26 lg:leading-40">
            Wichtig! Aktuell gibt es Probleme bei der Interaktion mit ELSTER.
            Sie könnten daher mehr Fehler bekommen, wir bitten um
            Entschuldigung. Wir arbeiten daran das Problem zu beheben.
          </div>
        </ContentContainer>
      </div>
      <Main>{props.children}</Main>
    </Layout>
  );
}
