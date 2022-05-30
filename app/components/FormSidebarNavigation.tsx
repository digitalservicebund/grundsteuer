import { useEffect, useState } from "react";
import { useLocation } from "@remix-run/react";
import classNames from "classnames";
import { TFunction, useTranslation } from "react-i18next";
import { getCurrentStateFromPathname } from "~/util/getCurrentState";
import { Graph, GraphChildElement } from "~/domain";
import { NavigationLink } from "~/components";

export function GraphNavigationLink(props: any) {
  const { path, pathWithId, currentState, data } = props;
  const { t } = useTranslation("all");

  const isActive = pathWithId === currentState;

  return (
    <NavigationLink
      isFinished={!!data || pathWithId === "welcome"}
      to={`/formular/${pathWithId.split(".").join("/")}`}
      isActive={isActive}
      isAllCaps={pathWithId === "welcome"}
    >
      {t(`nav.${path}`)}
    </NavigationLink>
  );
}

const renderGraph = (
  graph: Graph | GraphChildElement,
  level: number,
  currentState: string,
  t: TFunction<"all", undefined>
) => {
  return (
    <>
      {graph &&
        Object.entries(graph).map(([k, v]) => {
          if ((v as Graph).path) {
            if (v.path === "zusammenfassung") {
              return null;
            }
            return (
              <div key={k}>
                <GraphNavigationLink {...v} currentState={currentState} />
              </div>
            );
          } else if (Array.isArray(v)) {
            return (
              <div key={k}>
                {v.map((c, index) => (
                  <div key={index}>
                    <div className="pl-16">
                      <hr className={classNames("h-1 my-8 bg-gray-400")} />
                      <div
                        className={classNames(
                          "italic text-16 leading-24 pl-8 py-8"
                        )}
                      >
                        {t(`nav.headline.${k}`, { number: index + 1 })}{" "}
                      </div>
                      {renderGraph(c, level + 1, currentState, t)}
                    </div>
                  </div>
                ))}
              </div>
            );
          } else {
            return (
              <div key={k}>
                <hr className="h-1 my-8 bg-gray-400" />
                <div
                  className={classNames({
                    "pl-16": level !== 0,
                  })}
                >
                  <div
                    className={classNames({
                      "uppercase font-bold text-14 leading-24 pl-8 py-8":
                        level === 0,
                    })}
                  >
                    {t(`nav.headline.${k}`)}{" "}
                  </div>
                  {renderGraph(v, level + 1, currentState, t)}
                </div>
              </div>
            );
          }
        })}
    </>
  );
};

export default function FormSidebarNavigation({
  graph,
  initialCurrentState,
}: {
  graph: Graph;
  initialCurrentState: string;
}) {
  const { t } = useTranslation("all");
  const location = useLocation();
  const [currentState, setCurrentState] = useState(initialCurrentState);

  useEffect(() => {
    const newCurrentState = getCurrentStateFromPathname(location.pathname);
    setCurrentState(newCurrentState);
  }, [location]);

  return <nav className="px-8">{renderGraph(graph, 0, currentState, t)}</nav>;
}
