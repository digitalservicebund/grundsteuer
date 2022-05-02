import classNames from "classnames";
import { ReactNode } from "react";

export default function FormGroup(props: {
  children: ReactNode;
  isLast?: boolean;
}) {
  const cssClasses = classNames(props.isLast ? "mb-64" : "mb-24");
  return <div className={cssClasses}>{props.children}</div>;
}
