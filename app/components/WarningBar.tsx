import { ReactNode } from "react";
import ExclamationMark from "~/components/icons/mui/ExclamationMark";
import classNames from "classnames";

export default function WarningBar(props: {
  heading?: ReactNode | string;
  children: ReactNode;
  className?: string;
}) {
  const heading = props.heading || "Hinweis";
  return (
    <div
      className={classNames(
        "bg-yellow-200 px-32 py-24 flex flex-row",
        props.className
      )}
    >
      <div className="flex flex-col">
        <div className="flex items-center mb-10">
          <ExclamationMark className="mr-10 w-20 h-20" />
          <strong className="uppercase text-11">{heading}</strong>
        </div>
        {props.children}
      </div>
    </div>
  );
}
