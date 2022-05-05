import classNames from "classnames";
import FieldError from "./FieldError";

export interface RadioProps
  extends Omit<React.ComponentPropsWithoutRef<"input">, "type"> {
  error?: string;
}

export default function Radio(props: RadioProps) {
  const { children, name, id, error, ...otherProps } = props;

  const derivedId = id || `${name}-${props.value}`;

  const inputComponent = (
    <input
      type="radio"
      name={name}
      id={derivedId}
      className="radio__input"
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
}
