import classNames from "classnames";
import QuestionMark from "~/components/icons/mui/QuestionMark";
import Details from "~/components/Details";
import FieldError from "./FieldError";

export interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<"input">, "type"> {
  help?: string;
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

  if (help) {
    return (
      <>
        <Details
          summaryContent={
            <div className="position-relative">
              {inputComponent}
              {labelComponent}
              <QuestionMark
                className="inline-block float-right"
                role="img"
                aria-label="Hinweis"
              />
            </div>
          }
          detailsContent={<p>{help}</p>}
        />
        {errorComponent}
      </>
    );
  } else {
    return (
      <>
        {inputComponent}
        {labelComponent}
        {errorComponent}
      </>
    );
  }
}
