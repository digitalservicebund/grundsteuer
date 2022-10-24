import classNames from "classnames";
import FieldError from "./FieldError";
import { ReactElement } from "react";
import Help from "~/components/form/help/Help";

export interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<"input">, "type"> {
  help?: ReactElement;
  error?: string;
}

export default function Checkbox(props: CheckboxProps) {
  const { children, name, id, help, defaultValue, error, ...otherProps } =
    props;

  const inputComponent = (
    <input
      defaultChecked={!!defaultValue}
      type="checkbox"
      name={name}
      value="true"
      id={id || name}
      className="checkbox__input"
      {...otherProps}
    />
  );
  const labelComponent = (
    <label
      htmlFor={id || name}
      className={classNames("checkbox__label text-18 leading-26", {
        "has-error": error,
      })}
    >
      {children}
    </label>
  );

  const errorComponent = error && (
    <div className="pl-48">
      <FieldError>{error}</FieldError>
    </div>
  );

  return (
    <>
      <div>
        {inputComponent}
        {labelComponent}
        {errorComponent}
      </div>
      {help && <Help summaryClassNames={"ml-[48px]"}>{help}</Help>}
    </>
  );
}
