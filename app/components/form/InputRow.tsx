import { ReactNode } from "react";

export default function InputRow(props: { children: ReactNode }) {
  const { children } = props;
  return (
    <fieldset className="flex-col md:flex-row flex items-baseline gap-x-24">
      {children}
    </fieldset>
  );
}
