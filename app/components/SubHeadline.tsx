import { ReactNode } from "react";

export default function SubHeadline(props: { children: ReactNode }) {
  return <h2 className="mb-24 text-24 leading-30">{props.children}</h2>;
}
