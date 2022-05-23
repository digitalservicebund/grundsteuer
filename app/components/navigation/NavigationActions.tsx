import { useEffect, useState } from "react";
import { useLocation } from "@remix-run/react";
import { Button, LogoutButton } from "~/components";
import EmailOutlinedIcon from "~/components/icons/mui/EmailOutlined";
import DriveFileRenameOutlineIcon from "~/components/icons/mui/DriveFileRenameOutline";
import NavigationLink from "./NavigationLink";

export default function NavigationActions(props: {
  userIsIdentified?: boolean;
  userIsLoggedIn?: boolean;
}) {
  if (!props.userIsLoggedIn) return null;

  const location = useLocation();
  const [currentLocation, setCurrentLocation] = useState(location.pathname);

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
        Prüfen & Versenden
      </NavigationLink>
    </div>
  );
}
