import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import ErrorBanner from "~/components/ErrorBanner";
import { Flags } from "~/flags.server";

export interface LayoutProps {
  /**
   * The main content
   */
  children: ReactNode;
  /**
   * The top navigation which is only visible on smaller screens
   */
  topNavigation: ReactNode;
  /**
   * The sidebar navigation which is only visible on larger screens
   */
  sidebarNavigation: ReactNode;

  /**
   * The logout menu displayed only on larger screens
   */
  logoutMenu: ReactNode;
  /**
   * The footer
   */
  footer: ReactNode;

  flags?: Flags;
  path?: string;
  isMobile?: boolean;
}

const Layout = ({
  children,
  footer,
  sidebarNavigation,
  logoutMenu,
  topNavigation,
  flags,
  path,
  isMobile,
}: LayoutProps) => {
  const { t } = useTranslation("all");

  return (
    <div className="flex items-stretch min-h-screen">
      <header className="w-[256px] flex-shrink-0 hidden lg:block">
        <div className="h-full bg-white">{sidebarNavigation}</div>
      </header>
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col">
          {flags?.ericaDown &&
            path &&
            (path.includes("/fsc") || path === "/identifikation") && (
              <ErrorBanner
                heading={t("banners.ericaDownHeading")}
                service="erica"
              >
                {t("banners.ericaDownBody")}
              </ErrorBanner>
            )}
          {flags?.ericaDown && path === "/formular/zusammenfassung" && (
            <ErrorBanner
              heading={t("banners.ericaDownZusammenfassungHeading")}
              service="erica"
            >
              {t("banners.ericaDownZusammenfassungBody")}
            </ErrorBanner>
          )}
          {flags?.ekonaDown &&
            (path === "/ekona" || path === "/identifikation") && (
              <ErrorBanner
                heading={t("banners.ekonaDownHeading")}
                service="ekona"
              >
                {t("banners.ekonaDownBody")}
              </ErrorBanner>
            )}
          {!flags?.bundesIdentDisabled &&
            isMobile &&
            flags?.bundesIdentDown &&
            path &&
            (path.includes("/bundesIdent") || path === "/identifikation") && (
              <ErrorBanner
                heading={t("banners.bundesIdentDownHeading")}
                service="bundesident"
              >
                {t("banners.bundesIdentDownBody")}
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
        </div>
        <header className="flex-shrink-0 bg-white lg:hidden">
          {topNavigation}
        </header>
        <div className="justify-end mr-48 hidden lg:flex">{logoutMenu}</div>
        <main className="flex-grow relative">{children}</main>
        <footer className="flex-shrink-0 pl-2">{footer}</footer>
      </div>
    </div>
  );
};

export default Layout;
