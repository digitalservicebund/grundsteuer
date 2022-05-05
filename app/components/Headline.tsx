import { ReactNode } from "react";

export default function Headline(props: {
  children: ReactNode;
  asLegend?: boolean;
}) {
  const cssClasses = "mb-32 text-30 leading-36";
  if (props.asLegend) {
    return <legend className={cssClasses}>{props.children}</legend>;
  }
  return <h1 className={cssClasses}>{props.children}</h1>;
}
