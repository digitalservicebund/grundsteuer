import { useEffect, useState } from "react";
import { useLocation } from "@remix-run/react";
import EmailOutlinedIcon from "~/components/icons/mui/EmailOutlined";
import NavigationLink from "./NavigationLink";
import Lock from "~/components/icons/mui/Lock";
import AddFile from "~/components/icons/mui/AddFile";
import LogoutMenu from "~/components/navigation/LogoutMenu";

export default function NavigationActions(props: {
  userIsIdentified?: boolean;
  userHasFinishedProcess?: boolean;
}) {
  const location = useLocation();
  const [currentLocation, setCurrentLocation] = useState(location.pathname);

  useEffect(() => {
    setCurrentLocation(location.pathname);
  }, [location]);

  return (
    <div className="px-8 mb-32">
      <LogoutMenu
        containerClasses="lg:hidden"
        statusClasses="mb-16 rounded-t py-4"
      />

      {!props.userIsIdentified && (
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
