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
    <div className="flex items-stretch min-h-screen">
      <header className="w-[256px] flex-shrink-0 hidden lg:block">
        <div className="h-full bg-white border border-red-500">
          {sidebarNavigation}
        </div>
      </header>
      <div className="flex flex-col flex-grow">
        <header className="flex-shrink-0 bg-white lg:hidden">
          {topNavigation}
        </header>
        <main className="flex-grow">{children}</main>
        <footer className="flex-shrink-0">{footer}</footer>
      </div>
    </div>
  );
};

export default Layout;
