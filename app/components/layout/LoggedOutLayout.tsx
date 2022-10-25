import type { ReactNode } from "react";
import ContentContainer from "../ContentContainer";
import Footer from "../Footer";
import { HomepageHeader } from "~/components/navigation/HomepageHeader";
import ErrorBanner from "~/components/ErrorBanner";
import { useTranslation } from "react-i18next";
import { Flags } from "~/flags.server";

export default function LoggedOutLayout(props: {
  children: ReactNode;
  flags?: Flags;
}) {
  const { t } = useTranslation();
  return (
    <>
      {props.flags?.sendinblueDown && (
        <ErrorBanner
          heading={t("banners.sendinblueDownHeading")}
          service="sendinblue"
        >
          <div> {t("banners.sendinblueDownBody")} </div>
        </ErrorBanner>
      )}
      {props.flags?.zammadDown && (
        <ErrorBanner
          style="warning"
          heading={t("banners.zammadDownHeading")}
          service="zammad"
        >
          <div> {t("banners.zammadDownBody")} </div>
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
