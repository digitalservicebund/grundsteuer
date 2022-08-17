import type { ReactNode } from "react";
import ContentContainer from "../ContentContainer";
import Footer from "../Footer";
import { HomepageHeader } from "~/components/navigation/HomepageHeader";
import { testFeaturesEnabled } from "~/util/testFeaturesEnabled";

export default function LoggedOutLayout(props: { children: ReactNode }) {
  return (
    <>
      <HomepageHeader showNewFeatures={testFeaturesEnabled()} />
      <main className="flex-grow">
        <ContentContainer>{props.children}</ContentContainer>
      </main>
      <Footer />
    </>
  );
}
