import type { ReactNode } from "react";
import ContentContainer from "../ContentContainer";
import Footer from "../Footer";
import { HomepageHeader } from "~/components/navigation/HomepageHeader";

export default function LoggedOutLayout(props: { children: ReactNode }) {
  return (
    <>
      <HomepageHeader />
      <main className="flex-grow pt-32">
        <ContentContainer>{props.children}</ContentContainer>
      </main>
      <Footer />
    </>
  );
}
