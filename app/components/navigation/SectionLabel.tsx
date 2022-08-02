import { ReactNode } from "react";
import classNames from "classnames";

type SectionLabelProps = {
  background: "white" | "blue" | "gray";
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function SectionLabel(props: SectionLabelProps) {
  const cssClassNames = classNames(
    "pl-8 py-4 pr-16 rounded inline-flex items-center text-gray-900 uppercase tracking-1 text-11 leading-16 font-bold",
    {
      "bg-white/75": props.background === "white",
      "bg-blue-200": props.background === "blue",
      "bg-gray-300": props.background === "gray",
    },
    props.className
  );

  return (
    <div className={cssClassNames}>
      <div className="text-24 mr-4">{props.icon}</div>
      <div className="py-4">{props.children}</div>
    </div>
  );
}
