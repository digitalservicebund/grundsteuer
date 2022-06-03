import { ReactNode } from "react";

export default function SectionLabel(props: {
  label: string | ReactNode;
  icon: ReactNode;
}) {
  return (
    <div className="bg-gray-300 flex flex-row p-10 w-fit px-16 items-center my-16 h-36 rounded">
      <div className="mr-10">{props.icon}</div>
      <h3 className="font-bold uppercase text-10 text-gray-900">
        {props.label}
      </h3>
    </div>
  );
}
