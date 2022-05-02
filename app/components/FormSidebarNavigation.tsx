import { useEffect, useState } from "react";
import { Link, useLocation } from "@remix-run/react";
import classNames from "classnames";
import { TFunction, useTranslation } from "react-i18next";
import { getCurrentStateFromPathname } from "~/util/getCurrentState";
import finishedIcon from "~/assets/images/navigation-finished.svg";
import unfinishedIcon from "~/assets/images/navigation-unfinished.svg";
import { Graph, GraphChildElement } from "~/domain";

export function NavigationLink(props: any) {
  const { path, pathWithId, currentState, data } = props;
  const { t } = useTranslation("all");

  const isActive = pathWithId === currentState;

  return (
    <div>
      <img
        src={data ? finishedIcon : unfinishedIcon}
        alt={"Erledigt"}
        className="inline-block mr-16"
      />
      <Link
        className={classNames("my-8", {
          "font-bold": isActive,
        })}
        to={`/formular/${pathWithId.split(".").join("/")}`}
      >
        {t(`nav.${path}`)}
      </Link>
    </div>
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
            return (
              <div key={k}>
                <NavigationLink {...v} currentState={currentState} />
              </div>
            );
          } else if (Array.isArray(v)) {
            return (
              <div key={k}>
                {v.map((c, index) => (
                  <div key={index}>
                    <hr className="my-16 bg-gray-400" />
                    <div className="pl-16">
                      <span className={classNames("inline-block italic")}>
                        {t(`nav.headline.${k}`, { number: index + 1 })}{" "}
                      </span>
                      {renderGraph(c, level + 1, currentState, t)}
                    </div>
                  </div>
                ))}
              </div>
            );
          } else {
            return (
              <div key={k}>
                <hr className="my-16 bg-gray-400" />
                <div
                  className={classNames("inline-block", {
                    "pl-16": level != 0,
                  })}
                >
                  <span
                    className={classNames("inline-block", {
                      "uppercase font-bold": level == 0,
                    })}
                  >
                    {t(`nav.headline.${k}`)}{" "}
                  </span>
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

  return <nav className="pl-16">{renderGraph(graph, 0, currentState, t)}</nav>;
}
