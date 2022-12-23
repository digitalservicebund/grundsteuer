import { ReactNode } from "react";
import classNames from "classnames";
import ArrowRight from "~/components/icons/mui/ArrowRight";

export default function LinkWithArrow(props: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const cssClasses = classNames("flex items-center", props.className);
  return (
    <div className={cssClasses}>
      <ArrowRight className="inline-block mr-16" />
      <a
        href={props.href}
        className="font-bold underline text-18 text-blue-800"
      >
        {props.children}
      </a>
    </div>
  );
}
