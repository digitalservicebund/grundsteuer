import { ReactNode } from "react";
import ErrorBar from "~/components/ErrorBar";
import { useTranslation } from "react-i18next";

export interface Banners {
  ekonaDown?: boolean;
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
}

const Layout = ({
  children,
  footer,
  sidebarNavigation,
  logoutMenu,
  topNavigation,
  banners,
}: LayoutProps) => {
  const { t } = useTranslation("all");

  return (
    <div className="flex items-stretch min-h-screen">
      <header className="w-[256px] flex-shrink-0 hidden lg:block">
        <div className="h-full bg-white">{sidebarNavigation}</div>
      </header>
      <div className="flex flex-col flex-grow">
        {banners?.ekonaDown && (
          <ErrorBar heading={t("banners.ekonaDownHeading")}>
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
