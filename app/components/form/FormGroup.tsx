import { ReactNode } from "react";

type FormGroupProps = {
  children: ReactNode;
};

export default function FormGroup(props: FormGroupProps): JSX.Element {
  const { children } = props;
  return <div className="mb-24 md:mb-32">{children}</div>;
}
