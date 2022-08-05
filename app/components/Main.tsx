import { ReactNode } from "react";

export default function Main(props: { children: ReactNode }) {
  return (
    <div className="px-16 pt-16 pb-80 bg-gray-100 md:pl-128 sm:pt-0">
      {props.children}
    </div>
  );
}
