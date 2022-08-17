import type { ReactNode } from "react";
import ContentContainer from "../ContentContainer";
import Footer from "../Footer";
import { HomepageHeader } from "~/components/navigation/HomepageHeader";

export default function LoggedOutLayout(props: {
  children: ReactNode;
  showNewFeatures?: boolean;
}) {
  return (
    <>
      <HomepageHeader showNewFeatures={props.showNewFeatures} />
      <main className="flex-grow">
        <ContentContainer>{props.children}</ContentContainer>
      </main>
      <Footer />
    </>
  );
}
