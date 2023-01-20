import { ReactNode } from "react";
import classNames from "classnames";
import ArrowRight from "~/components/icons/mui/ArrowRight";
import OpenTab from "~/components/icons/mui/OpenTab";

export default function LinkWithArrow(props: {
  href: string;
  children: ReactNode;
  external?: boolean;
  className?: string;
}) {
  const cssClasses = classNames("flex items-center", props.className);
  return (
    <div className={cssClasses}>
      {props.external ? (
        <OpenTab className="inline-block mr-16 w-[36px] h-[36px]" />
      ) : (
        <ArrowRight className="inline-block mr-16 w-[36px] h-[36px]" />
      )}
      <a
        href={props.href}
        target={props.external ? "_blank" : "_self"}
        className="font-bold underline text-18 text-blue-800"
      >
        {props.children}
      </a>
    </div>
  );
}
