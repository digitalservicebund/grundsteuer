import { ReactNode } from "react";

export interface LayoutProps {
  /**
  The main content
  */
  children: ReactNode;
  /**
  The top navigation which is only visible on smaller screens
  */
  topNavigation: ReactNode;
  /**
  The sidebar navigation which is only visible on larger screens
  */
  sidebarNavigation: ReactNode;
  /**
  The footer
  */
  footer: ReactNode;
}

const Layout = ({
  children,
  footer,
  sidebarNavigation,
  topNavigation,
}: LayoutProps) => {
  return (
    <div className="flex items-stretch min-h-full">
      <header className="w-[220px] flex-shrink-0 hidden lg:block ">
        <div className="h-full h-md:sticky h-md:top-0 h-md:h-screen bg-grey-100">
          {sidebarNavigation}
        </div>
      </header>
      <div className="flex flex-col flex-grow">
        <header className="flex-shrink-0 lg:hidden bg-grey-100">
          {topNavigation}
        </header>
        <main className="flex-grow">{children}</main>
        <footer className="flex-shrink-0">{footer}</footer>
      </div>
    </div>
  );
};

export default Layout;
