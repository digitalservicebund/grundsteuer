import classNames from "classnames";
import type { ReactNode } from "react";

export default function ContentContainer(props: {
  children: ReactNode;
  size?: string;
  className?: string;
}) {
  const cssClasses = classNames(
    {
      "sm:max-w-[412px]": props.size === "sm",
      "max-w-screen-xl mx-auto px-16 md:px-32 lg:px-64": !props.size,
    },
    props.className
  );

  return <div className={cssClasses}>{props.children}</div>;
}
