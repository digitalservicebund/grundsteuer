import classNames from "classnames";
import { forwardRef } from "react";
import FieldError from "./FieldError";

export interface RadioProps
  extends Omit<React.ComponentPropsWithoutRef<"input">, "type"> {
  error?: string;
}

export default forwardRef<HTMLInputElement, RadioProps>(function Radio(
  props,
  ref
) {
  const { children, name, id, error, ...otherProps } = props;

  const derivedId = id || `${name}-${props.value}`;

  const inputComponent = (
    <input
      type="radio"
      name={name}
      id={derivedId}
      className="radio__input"
      ref={ref}
      {...otherProps}
    />
  );

  const labelComponent = (
    <label
      htmlFor={derivedId}
      className={classNames("radio__label text-18 leading-26", {
        "has-error": error,
      })}
    >
      {children}
    </label>
  );

  const errorComponent = error && <FieldError>{error}</FieldError>;

  return (
    <>
      {inputComponent}
      {labelComponent}
      {errorComponent}
    </>
  );
});
