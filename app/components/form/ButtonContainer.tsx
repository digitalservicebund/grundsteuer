import classNames from "classnames";
import { ReactNode } from "react";

export default function ButtonContainer(props: {
  children: ReactNode;
  className?: string;
}) {
  const cssClasses = classNames(
    "button-container flex flex-wrap flex-row-reverse justify-between gap-24",
    props.className
  );
  return <div className={cssClasses}>{props.children}</div>;
}
