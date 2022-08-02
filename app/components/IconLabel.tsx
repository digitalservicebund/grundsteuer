import { ReactNode } from "react";
import classNames from "classnames";
import PersonIcon from "~/components/icons/mui/Person";
import RoomOutlinedIcon from "~/components/icons/mui/RoomOutlined";

type IconLabelProps = {
  background: "white" | "blue";
  className?: string;
  iconName: string;
  children: ReactNode;
};

export default function IconLabel(props: IconLabelProps) {
  const cssClassNames = classNames(
    "pl-8 py-4 pr-16 rounded inline-flex items-center text-gray-900 uppercase tracking-1 text-11 leading-16 font-bold",
    {
      "bg-white/75": props.background === "white",
      "bg-blue-200": props.background === "blue",
    },
    props.className
  );

  const icon = {
    person: <PersonIcon />,
    marker: <RoomOutlinedIcon />,
  }[props.iconName];

  return (
    <div className={cssClassNames}>
      <div className="text-24">{icon}</div>
      <div className="ml-4 py-4">{props.children}</div>
    </div>
  );
}
