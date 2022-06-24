import { ReactNode } from "react";
import classNames from "classnames";

type FieldErrorProps = {
  children: ReactNode;
  className?: string;
};

export default function FieldError(props: FieldErrorProps) {
  const { children, className } = props;
  return (
    <div className={classNames("text-red-800 mt-4", className)}>{children}</div>
  );
}
