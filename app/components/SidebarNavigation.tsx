import { conditions } from "~/domain/conditions";
import { Link } from "remix";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { RouteData } from "@remix-run/react/routeData";
import { GrundDataModelData } from "~/domain/model";

export type Handle = {
  showFormNavigation: boolean;
};

type MatchingRoute = {
  id: string;
  pathname: string;
  params: import("react-router").Params;
  data: RouteData;
  handle: Handle;
};

function getNavigationLink(
  href: string,
  matchingUrl: string,
  label: string,
  showFormNavigation: MatchingRoute
) {
  return (
    <Link
      to={href}
      className={classNames({
        "font-bold": showFormNavigation.pathname.includes(matchingUrl),
      })}
    >
      {label}
    </Link>
  );
}

export default function SidebarNavigation({
  matchingRoutes,
  data,
}: {
  matchingRoutes: MatchingRoute[];
  data: GrundDataModelData;
}) {
  const { t } = useTranslation("common");

  const showFormNavigation = matchingRoutes.find(
    (match) => match.handle?.showFormNavigation
  );

  return (
    <>
      {showFormNavigation ? (
        <div>
          {getNavigationLink(
            "/steps/eigentuemer/anzahl",
            "/steps/eigentuemer",
            t("nav.eigentuemer"),
            showFormNavigation
          )}
          <br />
          {getNavigationLink(
            "/steps/grundstueck",
            "/steps/grundstueck",
            t("nav.grundstueck"),
            showFormNavigation
          )}
          {conditions.showGebaeude(data) && (
            <>
              <br />
              {getNavigationLink(
                "/steps/gebaeude",
                "/steps/gebaeude",
                t("nav.gebaeude"),
                showFormNavigation
              )}
            </>
          )}
          <br />
          {getNavigationLink(
            "/steps/zusammenfassung",
            "/steps/zusammenfassung",
            t("nav.zusammenfassung"),
            showFormNavigation
          )}
        </div>
      ) : (
        <div className="h-full p-4 bg-white">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
