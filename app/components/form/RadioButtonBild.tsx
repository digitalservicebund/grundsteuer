import classNames from "classnames";
import FieldError from "./FieldError";

export interface RadioBildProps
  extends Omit<React.ComponentPropsWithoutRef<"input">, "type"> {
  image: string;
  imageAltText: string;
  error?: string;
}

export default function RadioButtonBild(props: RadioBildProps) {
  const { children, name, id, error, image, imageAltText, ...otherProps } =
    props;

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
      className={classNames(
        "radio__label flex items-center text-18 leading-26",
        {
          "has-error": error,
        }
      )}
    >
      {children}
    </label>
  );

  const errorComponent = error && <FieldError>{error}</FieldError>;

  return (
    <>
      <div
        className={classNames(
          "py-24 px-32 radio-image-card flex items-center",
          props.className
        )}
      >
        <img
          src={image}
          alt={imageAltText}
          className="mr-24 w-1/3 max-w-[150px] max-h-[150px]"
        />
        {inputComponent}
        {labelComponent}
        {errorComponent}
      </div>
    </>
  );
}
