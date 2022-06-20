import { ReactNode } from "react";
import classNames from "classnames";

export default function SubHeadline(props: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2 className={classNames("mb-24 text-24 leading-30", props.className)}>
      {props.children}
    </h2>
  );
}
