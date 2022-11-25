import { LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { Footer } from "~/components";
import ErrorBanner from "~/components/ErrorBanner";
import Header from "~/components/navigation/Header";
import { flags } from "~/flags.server";
import { getSession } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  return { user: session.get("user"), flags: flags.getAllFlags() };
};

export default function InfoLayout() {
  const { flags, user } = useLoaderData();
  const { t } = useTranslation();

  return (
    <>
      {flags?.grundsteuerDown && (
        <ErrorBanner
          style="warning"
          heading={t("banners.grundsteuerDownHeading")}
          service="grundsteuer"
        >
          <div> {t("banners.grundsteuerDownBody")} </div>
        </ErrorBanner>
      )}
      {flags?.sendinblueDown && (
        <ErrorBanner
          heading={t("banners.sendinblueDownHeading")}
          service="sendinblue"
        >
          <div> {t("banners.sendinblueDownBody")} </div>
        </ErrorBanner>
      )}
      {flags?.zammadDown && (
        <ErrorBanner
          style="warning"
          heading={t("banners.zammadDownHeading")}
          service="zammad"
        >
          <div> {t("banners.zammadDownBody")} </div>
        </ErrorBanner>
      )}
      <Header email={user?.email} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
