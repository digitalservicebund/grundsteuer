import { useEffect, useState } from "react";
import { useLocation } from "@remix-run/react";
import { LogoutButton } from "~/components";
import EmailOutlinedIcon from "~/components/icons/mui/EmailOutlined";
import NavigationLink from "./NavigationLink";
import Lock from "~/components/icons/mui/Lock";
import AddFile from "~/components/icons/mui/AddFile";

export default function NavigationActions(props: {
  userIsIdentified?: boolean;
  userHasFinishedProcess?: boolean;
  showNewIdent?: boolean;
}) {
  const location = useLocation();
  const [currentLocation, setCurrentLocation] = useState(location.pathname);

  useEffect(() => {
    setCurrentLocation(location.pathname);
  }, [location]);

  return (
    <div className="px-8 mb-32">
      <LogoutButton />

      {!props.userIsIdentified && !props.showNewIdent && (
        <NavigationLink
          to="/fsc"
          icon={<Lock className="w-24 h-24 fill-blue-800" />}
          isAllCaps
          isActive={!!currentLocation.match(/\/fsc\//)}
        >
          Freischaltcode
        </NavigationLink>
      )}
      {!props.userIsIdentified && props.showNewIdent && (
        <NavigationLink
          to="/identifikation"
          icon={<Lock className="w-24 h-24 fill-blue-800" />}
          isAllCaps
          isActive={
            !!currentLocation.match(/(\/identifikation|\/fsc\/|\/ekona)/)
          }
        >
          Identifikation
        </NavigationLink>
      )}
      {!props.userHasFinishedProcess && (
        <NavigationLink
          to="/formular/zusammenfassung"
          icon={<EmailOutlinedIcon className="w-24 h-24 fill-blue-800" />}
          isAllCaps
          isActive={!!currentLocation.match(/\/formular\/zusammenfassung/)}
        >
          Übersicht & Abgeben
        </NavigationLink>
      )}
      {props.userHasFinishedProcess && (
        <NavigationLink
          to="/formular/weitereErklaerung"
          icon={<AddFile className="w-24 h-24 fill-blue-800" />}
          isAllCaps
          isActive={!!currentLocation.match(/\/formular\/weitereErklaerung/)}
        >
          Weitere Erklärung Abgeben
        </NavigationLink>
      )}
    </div>
  );
}
