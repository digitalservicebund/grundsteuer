import { ReactNode } from "react";
import ExclamationMark from "~/components/icons/mui/ExclamationMark";
import classNames from "classnames";

export default function ErrorBar(props: {
  heading?: ReactNode | string;
  children: ReactNode;
  className?: string;
}) {
  const heading = props.heading || "Hinweis";
  return (
    <div
      className={classNames(
        "bg-red-200 border-l-[8px] border-l-red-900 pl-16 pr-32 py-16 mb-8 flex flex-row",
        props.className
      )}
    >
      <ExclamationMark className="mr-10 min-w-[20px]" />
      <div className="flex flex-col">
        <strong>{heading}</strong>
        {props.children}
      </div>
    </div>
  );
}
