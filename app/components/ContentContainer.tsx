import type { ReactNode } from "react";

export default function ContentContainer(props: { children: ReactNode }) {
  return (
    <div className="max-w-screen-xl mx-auto px-16 md:px-32 lg:px-64">
      {props.children}
    </div>
  );
}
