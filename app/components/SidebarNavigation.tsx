import { Link } from "@remix-run/react";
import { ReactNode } from "react";
import { Button, FscButton, LogoutButton } from "~/components";
import EmailOutlinedIcon from "~/components/icons/mui/EmailOutlined";

export default function SidebarNavigation(props: {
  children?: ReactNode;
  userIsIdentified?: boolean;
  userIsLoggedIn?: boolean;
}) {
  return (
    <div className="pt-24 pb-64">
      <Link to="/" className="block p-16 mb-8 text-18 leading-24">
        <div className="font-bold">Grundsteuererklärung</div>
        für Privateigentum
      </Link>
      {props.userIsLoggedIn && (
        <div>
          <LogoutButton />
          {!props.userIsIdentified && <FscButton />}
          <Button
            to="/formular/zusammenfassung"
            look="ghost"
            size="small"
            icon={<EmailOutlinedIcon />}
          >
            Prüfen & Versenden
          </Button>
          <br />
        </div>
      )}

      {props.children}
    </div>
  );
}
