import { ReactNode, useState, useEffect } from "react";
import { useLocation } from "@remix-run/react";
import { NavigationLogo } from "~/components";
import MenuIcon from "~/components/icons/mui/Menu";
import CloseIcon from "~/components/icons/mui/Close";

type TopNavigationProps = {
  children?: ReactNode;
  actions: ReactNode;
};

export default function TopNavigation(props: TopNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <div>
      <input
        type="checkbox"
        id="top-navigation"
        checked={isOpen}
        onChange={() => null}
        className="sr-only peer"
      />

      <div className="peer-checked:fixed z-10 top-0 left-0 w-full bg-white flex justify-between">
        <NavigationLogo className="py-16 px-24 text-14 leading-16" />
        <label
          htmlFor="top-navigation"
          role="button"
          aria-controls="top-navigation-content"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          className="top-navigation__menu-button flex items-center gap-10 bg-gray-100 px-24 mb-2 text-blue-800 text-18 font-bold border-t-2 border-white"
        >
          <MenuIcon className="top-navigation__menu-icon w-36 h-36" />
          <CloseIcon className="top-navigation__close-icon hidden w-36 h-36" />
          Menü
        </label>
      </div>

      <div
        id="top-navigation-content"
        className="peer-checked:flex overflow-y-auto bg-white fixed z-10 top-64 left-0 w-full h-full hidden flex-wrap md:gap-32 px-16 pt-48 pb-80 md:px-24"
      >
        <div className="min-w-[16rem] flex-[1_0_16rem]">{props.actions}</div>
        <div className="min-w-[16rem] flex-[4_0_16rem]">{props.children}</div>
      </div>
    </div>
  );
}
