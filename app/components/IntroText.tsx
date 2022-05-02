import classNames from "classnames";
import { ReactNode } from "react";

export default function IntroText(props: {
  children: ReactNode;
  className?: string;
}) {
  const cssClasses = classNames("mb-32 text-18 leading-26", props.className);
  return <p className={cssClasses}>{props.children}</p>;
}
