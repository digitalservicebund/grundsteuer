import { ReactNode } from "react";
import ErrorBar from "~/components/ErrorBar";
import { useTranslation } from "react-i18next";

export interface Banners {
  ekonaDown?: boolean;
  ericaDown?: boolean;
}

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

  banners?: Banners;
  path?: string;
}

const Layout = ({
  children,
  footer,
  sidebarNavigation,
  logoutMenu,
  topNavigation,
  banners,
  path,
}: LayoutProps) => {
  const { t } = useTranslation("all");

  return (
    <div className="flex items-stretch min-h-screen">
      <header className="w-[256px] flex-shrink-0 hidden lg:block">
        <div className="h-full bg-white">{sidebarNavigation}</div>
      </header>
      <div className="flex flex-col flex-grow">
        {banners?.ericaDown &&
          path &&
          (path.includes("/fsc") || path === "/identifikation") && (
            <ErrorBar heading={t("banners.ericaDownHeading")} className="mb-8">
              {t("banners.ericaDownBody")}
            </ErrorBar>
          )}
        {banners?.ericaDown && path === "/formular/zusammenfassung" && (
          <ErrorBar
            heading={t("banners.ericaDownZusammenfassungHeading")}
            className="mb-8"
          >
            {t("banners.ericaDownZusammenfassungBody")}
          </ErrorBar>
        )}
        {banners?.ekonaDown &&
          (path === "/ekona" || path === "/identifikation") && (
            <ErrorBar heading={t("banners.ekonaDownHeading")} className="mb-8">
              {t("banners.ekonaDownBody")}
            </ErrorBar>
          )}
        <header className="flex-shrink-0 bg-white lg:hidden">
          {topNavigation}
        </header>
        <div className="justify-end mr-48 hidden lg:flex">{logoutMenu}</div>
        <main className="flex-grow">{children}</main>
        <footer className="flex-shrink-0 pl-2">{footer}</footer>
      </div>
    </div>
  );
};

export default Layout;
