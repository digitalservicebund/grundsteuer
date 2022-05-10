import classNames from "classnames";
import { ReactNode } from "react";

export default function ButtonContainer(props: {
  children: ReactNode;
  className?: string;
  forceMultiline?: boolean;
}) {
  const outerCssClasses = classNames(
    {
      "text-center md:text-left": true,
    },
    props.className
  );
  const innerCssClasses = classNames("inline-flex flex-col gap-24", {
    "md:flex md:flex-row-reverse md:justify-between": !props.forceMultiline,
  });
  return (
    <div className={outerCssClasses}>
      <div className={innerCssClasses}>{props.children}</div>
    </div>
  );
}
