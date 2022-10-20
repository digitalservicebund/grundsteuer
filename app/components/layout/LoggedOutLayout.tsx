import type { ReactNode } from "react";
import ContentContainer from "../ContentContainer";
import Footer from "../Footer";
import { HomepageHeader } from "~/components/navigation/HomepageHeader";
import ErrorBanner from "~/components/ErrorBanner";
import { Banners } from "~/components/layout/Layout";
import { useTranslation } from "react-i18next";

export default function LoggedOutLayout(props: {
  children: ReactNode;
  banners?: Banners;
}) {
  const { t } = useTranslation();
  return (
    <>
      {props.banners?.sendinblueDown && (
        <ErrorBanner heading={t("banners.sendinblueDownHeading")}>
          <div> {t("banners.sendinblueDownBody")} </div>
        </ErrorBanner>
      )}
      <HomepageHeader />
      <main className="flex-grow">
        <ContentContainer>{props.children}</ContentContainer>
      </main>
      <Footer />
    </>
  );
}
