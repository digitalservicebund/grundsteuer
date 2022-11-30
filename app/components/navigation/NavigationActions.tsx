import { useEffect, useState } from "react";
import { useLocation } from "@remix-run/react";
import EmailOutlinedIcon from "~/components/icons/mui/EmailOutlined";
import NavigationLink from "./NavigationLink";
import Lock from "~/components/icons/mui/Lock";
import AddFile from "~/components/icons/mui/AddFile";
import LogoutMenu from "~/components/navigation/LogoutMenu";
import Edit from "../icons/mui/Edit";

export default function NavigationActions(props: {
  email?: string;
  formularLink?: boolean;
  newDeclarationLink?: boolean;
}) {
  const location = useLocation();
  const [currentLocation, setCurrentLocation] = useState(location.pathname);

  useEffect(() => {
    setCurrentLocation(location.pathname);
  }, [location]);

  const itemsToRender = [];

  if (props.email) {
    itemsToRender.push(
      <LogoutMenu
        key="logout-menu"
        email={props.email as string}
        containerClasses="lg:hidden"
        statusClasses="mb-16 rounded-t py-4"
      />
    );
    if (props.formularLink) {
      itemsToRender.push(
        <NavigationLink
          key="formular-link"
          to="/formular"
          isAllCaps
          icon={<Edit className="w-24 h-24 text-blue-800" />}
        >
          Zum Formular
        </NavigationLink>
      );
    }
  } else {
    itemsToRender.push(
      <NavigationLink
        key="login-link"
        to="/anmelden"
        isAllCaps
        icon={<Edit className="w-24 h-24 text-blue-800" />}
      >
        Bearbeitung fortsetzen
      </NavigationLink>
    );
  }

  if (props.newDeclarationLink) {
    itemsToRender.push(
      <NavigationLink
        key="another-declaration-link"
        to="/formular/weitereErklaerung"
        icon={<AddFile className="w-24 h-24 fill-blue-800" />}
        isAllCaps
        isActive={!!currentLocation.match(/\/formular\/weitereErklaerung/)}
      >
        Weitere Erklärung abgeben
      </NavigationLink>
    );
  } else {
    itemsToRender.push(
      <NavigationLink
        key="identification-link"
        to="/identifikation"
        icon={<Lock className="w-24 h-24 fill-blue-800" />}
        isAllCaps
        isActive={!!currentLocation.match(/(\/identifikation|\/fsc\/|\/ekona)/)}
      >
        Identifikation
      </NavigationLink>
    );

    if (!currentLocation.match(/anmelden\/erfolgreich/)) {
      itemsToRender.push(
        <NavigationLink
          key="summary-link"
          to="/formular/zusammenfassung"
          icon={<EmailOutlinedIcon className="w-24 h-24 fill-blue-800" />}
          isAllCaps
          isActive={!!currentLocation.match(/\/formular\/zusammenfassung/)}
        >
          Übersicht & Abgeben
        </NavigationLink>
      );
    }
  }

  return <div className="px-8 mb-32">{itemsToRender}</div>;
}
