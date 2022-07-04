import type { ReactNode } from "react";
import ContentContainer from "../ContentContainer";
import Footer from "../Footer";

export default function SimplePageLayout(props: { children: ReactNode }) {
  return (
    <>
      <main className="flex-grow pt-32">
        <ContentContainer>{props.children}</ContentContainer>
      </main>
      <Footer />
    </>
  );
}
