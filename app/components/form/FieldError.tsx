import { ReactNode } from "react";

type FieldErrorProps = {
  children: ReactNode;
};

export default function FieldError(props: FieldErrorProps) {
  const { children } = props;
  return <div className="text-red-800 mt-4">{children}</div>;
}
