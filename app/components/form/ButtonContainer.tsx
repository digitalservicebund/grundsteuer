import classNames from "classnames";
import { ReactNode } from "react";

export default function ButtonContainer(props: {
  children: ReactNode;
  className?: string;
  singleButton?: boolean;
}) {
  const cssClasses = classNames(
    "button-container flex flex-wrap justify-between gap-24",
    {
      "flex-row-reverse": !props.singleButton,
    },
    props.className
  );
  return <div className={cssClasses}>{props.children}</div>;
}
