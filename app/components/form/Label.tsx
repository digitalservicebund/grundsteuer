import classNames from "classnames";
import { ReactNode } from "react";

export type LabelProps = {
  id: string;
  disabled?: boolean;
  children: ReactNode;
};

export default function Label(props: LabelProps) {
  const { id, disabled, children } = props;

  return (
    <label
      htmlFor={id}
      className={classNames("block mb-8", {
        "text-gray-600": disabled,
      })}
    >
      {children}
    </label>
  );
}
