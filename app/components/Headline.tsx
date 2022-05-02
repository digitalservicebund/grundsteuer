import { ReactNode } from "react";

export default function Headline(props: { children: ReactNode }) {
  return <h1 className="text-30 leading-36 mb-32">{props.children}</h1>;
}
