import { ReactNode } from "react";
import classNames from "classnames";

type SectionLabelProps = {
  backgroundColor: "white" | "white-full" | "blue" | "gray" | "yellow";
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function SectionLabel(props: SectionLabelProps) {
  const cssClassNames = classNames(
    "pl-8 py-4 pr-16 rounded inline-flex items-center text-gray-900 uppercase tracking-1 text-11 leading-16 font-bold",
    {
      "bg-white/75": props.backgroundColor === "white",
      "bg-white": props.backgroundColor === "white-full",
      "bg-blue-200": props.backgroundColor === "blue",
      "bg-gray-300": props.backgroundColor === "gray",
      "bg-yellow-emph": props.backgroundColor === "yellow",
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
