import classNames from "classnames";
import { ReactElement } from "react";

export default function EnumeratedList(props: {
  items: Array<string | ReactElement>;
  className?: string;
  gap?: string;
}) {
  const gap = props.gap || "16";
  return (
    <ul className={classNames("", props.className)}>
      {props.items.map((item, index) => {
        return (
          <li key={index} className={`flex flex-row mb-${gap}`}>
            <div className="mr-16 enumerate-icon inline-flex mb-auto">
              {index + 1}
            </div>
            <div className="inline-flex">{item}</div>
          </li>
        );
      })}
    </ul>
  );
}
