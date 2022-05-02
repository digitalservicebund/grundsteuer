import { ReactNode } from "react";

export default function FormGroup(props: { children: ReactNode }) {
  return <div className="form-group mb-24">{props.children}</div>;
}
