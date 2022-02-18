import React from "react";
import { conditions } from "~/domain/guards";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { RouteData } from "@remix-run/react/routeData";
import { GrundModel } from "~/domain/model";

export type Handle = {
  showFormNavigation: boolean;
};

export type MatchingRoute = {
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
    <a
      href={href}
      className={classNames({
        "font-bold": showFormNavigation.pathname.includes(matchingUrl),
      })}
    >
      {label}
    </a>
  );
}

export default function SidebarNavigation({
  matchingRoutes,
  data,
}: {
  matchingRoutes: MatchingRoute[];
  data: GrundModel;
}) {
  const { t } = useTranslation("common");

  const showFormNavigation = matchingRoutes.find(
    (match) => match.handle?.showFormNavigation
  );

  return (
    <nav>
      {showFormNavigation ? (
        <div>
          {getNavigationLink(
            "/formular/eigentuemer/anzahl",
            "/formular/eigentuemer",
            t("nav.eigentuemer"),
            showFormNavigation
          )}
          <br />
          {getNavigationLink(
            "/formular/grundstueck",
            "/formular/grundstueck",
            t("nav.grundstueck"),
            showFormNavigation
          )}
          {conditions.showGebaeude(data) && (
            <>
              <br />
              {getNavigationLink(
                "/formular/gebaeude",
                "/formular/gebaeude",
                t("nav.gebaeude"),
                showFormNavigation
              )}
            </>
          )}
          <br />
          {getNavigationLink(
            "/formular/zusammenfassung",
            "/formular/zusammenfassung",
            t("nav.zusammenfassung"),
            showFormNavigation
          )}
        </div>
      ) : (
        <div className="h-full p-4 bg-white">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
