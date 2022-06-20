import { ReactNode } from "react";
import classNames from "classnames";

export default function Headline(props: {
  children: ReactNode;
  asLegend?: boolean;
  className?: string;
}) {
  const cssClasses = classNames("mb-32 text-30 leading-36", props.className);
  if (props.asLegend) {
    return <legend className={cssClasses}>{props.children}</legend>;
  }
  return <h1 className={cssClasses}>{props.children}</h1>;
}
