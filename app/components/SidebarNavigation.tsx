import { Link } from "@remix-run/react";
import { ReactNode } from "react";

export default function SidebarNavigation(props: { children?: ReactNode }) {
  return (
    <div className="pt-24">
      <Link to="/" className="block p-16 mb-8 text-18 leading-24">
        <div className="font-bold">Grundsteuererklärung</div>
        für Privateigentum
      </Link>
      {props.children}
    </div>
  );
}
