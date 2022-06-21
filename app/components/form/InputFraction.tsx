import classNames from "classnames";
import React, { ReactNode } from "react";
import Slash from "~/components/icons/mui/Slash";
import Help from "~/components/form/help/Help";

export default function InputFraction(props: {
  zaehler: ReactNode;
  nenner: ReactNode;
  help?: ReactNode;
  className?: string;
}) {
  const { zaehler, nenner, help, className } = props;
  const cssClasses = classNames(
    "flex-row flex items-baseline input-width",
    className
  );
  return (
    <fieldset>
      <div className={cssClasses}>
        <div className="inline-block w-full">{zaehler}</div>
        <div className="self-end min-h-[3rem]">
          <Slash
            className="inline-block mx-16"
            role="img"
            aria-label="Schrägstrich"
          />
        </div>
        <div className="inline-block w-full">{nenner}</div>
      </div>
      {help && <Help>{help}</Help>}
    </fieldset>
  );
}
