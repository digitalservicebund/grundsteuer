import React from "react";
import { Link } from "remix";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

export function NavigationLink(props: any) {
  const { path, pathWithId, currentState, data } = props;
  const { t } = useTranslation("all");

  const isActive = pathWithId === currentState;

  return (
    <div>
      {data && Object.keys(data).length > 0 ? (
        <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
      ) : (
        ""
      )}
      <Link
        className={classNames("underline text-blue-900", {
          "font-bold": isActive,
        })}
        to={`/formular/${pathWithId.split(".").join("/")}`}
      >
        {t(`nav.${path}`)}
      </Link>
    </div>
  );
}

// TODO: Give more specific name: Form only
export default function SidebarNavigation({
  graph,
  currentState,
}: {
  graph: any;
  currentState: string;
}) {
  const { t } = useTranslation("all");

  const renderGraph = (graph: any, level: number, currentState: string) => {
    return (
      <div
        key={level}
        className={classNames({
          "pl-2": level === 1,
          "pl-4": level === 2,
          "pl-6": level === 3,
        })}
      >
        {graph &&
          Object.entries(graph).map(([k, v]) => {
            if ((v as any).path) {
              return (
                <div key={k}>
                  <NavigationLink {...v} currentState={currentState} />
                </div>
              );
            } else if (Array.isArray(v)) {
              return (
                <div key={k}>
                  {v
                    .filter((c) => c)
                    .map((c, index) => (
                      <div key={index}>
                        {t(`nav.headline.${k}`, { number: index + 1 })}{" "}
                        {renderGraph(c, level + 1, currentState)}
                      </div>
                    ))}
                </div>
              );
            } else {
              return (
                <div key={k}>
                  {t(`nav.headline.${k}`)}{" "}
                  {renderGraph(v, level + 1, currentState)}
                </div>
              );
            }
          })}
      </div>
    );
  };

  return <nav>{renderGraph(graph, 0, currentState)}</nav>;
}
