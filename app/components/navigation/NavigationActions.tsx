import { useEffect, useState } from "react";
import { useLocation } from "@remix-run/react";
import { LogoutButton } from "~/components";
import EmailOutlinedIcon from "~/components/icons/mui/EmailOutlined";
import DriveFileRenameOutlineIcon from "~/components/icons/mui/DriveFileRenameOutline";
import NavigationLink from "./NavigationLink";
import PersonCircle from "~/components/icons/mui/PersonCircle";
import LetterIcon from "~/components/icons/mui/LetterIcon";

export default function NavigationActions(props: {
  userIsIdentified?: boolean;
  userIsLoggedIn?: boolean;
}) {
  const location = useLocation();
  const [currentLocation, setCurrentLocation] = useState(location.pathname);

  if (!props.userIsLoggedIn) {
    return (
      <div className="px-8 mb-32">
        <NavigationLink
          to="/anmelden"
          icon={<PersonCircle className="w-24 h-24 fill-blue-800" />}
          isAllCaps
          isActive={!!currentLocation.match(/\/anmelden/)}
        >
          Anmelden
        </NavigationLink>
        <NavigationLink
          to="/hilfe"
          icon={<LetterIcon className="w-24 h-24 fill-blue-800" />}
          isAllCaps
          isActive={!!currentLocation.match(/\/hilfe/)}
        >
          Kontakt
        </NavigationLink>
      </div>
    );
  }

  useEffect(() => {
    setCurrentLocation(location.pathname);
  }, [location]);

  return (
    <div className="px-8 mb-32">
      <LogoutButton />

      {!props.userIsIdentified && (
        <NavigationLink
          to="/fsc"
          icon={
            <DriveFileRenameOutlineIcon className="w-24 h-24 fill-blue-800" />
          }
          isAllCaps
          isActive={!!currentLocation.match(/\/fsc\//)}
        >
          Freischaltcode
        </NavigationLink>
      )}
      <NavigationLink
        to="/formular/zusammenfassung"
        icon={<EmailOutlinedIcon className="w-24 h-24 fill-blue-800" />}
        isAllCaps
        isActive={!!currentLocation.match(/\/formular\/zusammenfassung/)}
      >
        Übersicht & Abgeben
      </NavigationLink>
    </div>
  );
}
