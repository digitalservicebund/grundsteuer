import { Link } from "remix";
import * as Collapsible from "@radix-ui/react-collapsible";

export function FormNavigation({ data }: { data: any }) {
  const linkClassNames = ["text-xl", "text-lg", "text-md", "text-sm"];
  const listItemClassNames = ["mb-4", "pl-2", "pl-2", "pl-2 "];

  function renderLink({
    id,
    title,
    urlName,
    resourceId,
    steps,
    level = 0,
    key = "",
    url = "/steps",
  }: {
    id: string;
    title?: string;
    urlName?: string;
    resourceId?: number;
    steps?: any[];
    level: number;
    key: string;
    url: string;
  }) {
    return (
      <li key={`${key}${id}`} className={`block ${listItemClassNames[level]}`}>
        {steps ? (
          <span>{title || id}</span>
        ) : (
          <Link
            to={`${url}/${urlName || id}${
              resourceId ? `?id=${resourceId}` : ""
            }`}
            className={`block border-b border-b-black ${linkClassNames[level]}`}
          >
            {title || id}
          </Link>
        )}
        {steps ? (
          <ol>
            {steps.map((step) =>
              renderLink({
                ...step,
                resourceId: step.resourceId || resourceId,
                level: level + 1,
                key: `${key}${id}`,
                url: `${url}/${urlName || id}`,
              })
            )}
          </ol>
        ) : (
          ""
        )}
      </li>
    );
  }

  return <ol className="m-2 p-2 bg-rose-300">{data.map(renderLink)}</ol>;
}
