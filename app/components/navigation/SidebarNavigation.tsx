import { ReactNode } from "react";
import { NavigationLogo } from "~/components";

export default function SidebarNavigation(props: {
  children?: ReactNode;
  actions: ReactNode;
}) {
  return (
    <div className="pt-24 pb-64">
      <NavigationLogo className="p-16 text-18 leading-24 mb-8" />
      {props.actions}
      {props.children}
    </div>
  );
}
