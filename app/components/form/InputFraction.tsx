import classNames from "classnames";
import { ReactNode } from "react";
import Slash from "~/components/icons/mui/Slash";

export default function InputFraction(props: {
  zaehler: ReactNode;
  nenner: ReactNode;
  className?: string;
}) {
  const { zaehler, nenner, className } = props;
  const cssClasses = classNames("flex-row flex items-baseline", className);
  return (
    <fieldset className={cssClasses}>
      <div className="inline-block w-full">{zaehler}</div>
      <div className="self-end min-h-[3rem]">
        <Slash className="inline-block mx-16" role="img" />
      </div>
      <div className="inline-block w-full">{nenner}</div>
    </fieldset>
  );
}
