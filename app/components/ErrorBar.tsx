import { ReactNode } from "react";

export default function ErrorBar(props: { children: ReactNode }) {
  return (
    <div className="bg-red-200 border-l-[16px] border-l-red-900 pl-48 py-16 mb-8">
      {props.children}
    </div>
  );
}
