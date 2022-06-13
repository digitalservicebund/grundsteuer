import React, { ReactElement } from "react";
import classNames from "classnames";
import Label from "./Label";
import Details from "../Details";
import FieldError from "./FieldError";
import QuestionMark from "~/components/icons/mui/QuestionMark";

export interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  name: string;
  value?: string;
  label?: string;
  error?: string;
  help?: ReactElement;
  defaultValue?: string;
  placeholder?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className, label, error, help, name, id, ...inputProps } = props;

  const labelComponent = label && (
    <Label id={id || name} disabled={inputProps.disabled}>
      {label}
    </Label>
  );

  const inputComponent = (
    <input
      {...inputProps}
      ref={ref}
      name={name}
      id={id || name}
      className={classNames(
        "block w-full",
        "bg-white text-black",
        "border-2 border-blue-800",
        "hover:outline hover:outline-4 hover:outline-blue-800 hover:outline-offset-[-4px]",
        "focus:outline focus:outline-4 focus:outline-blue-800 focus:outline-offset-[-4px]",
        "disabled:!text-gray-600 disabled:!border-gray-600 disabled:!outline-none",
        "px-24 min-h-[3.75rem] text-18 leading-24",
        {
          "border-red-800 bg-red-200": error,
        },
        className
      )}
    />
  );

  const errorComponent = error && <FieldError>{error}</FieldError>;

  return (
    <>
      <div className="input-width">
        {labelComponent}
        {inputComponent}
        {errorComponent}
      </div>
      {help && (
        <Details
          summaryContent={
            <>
              <QuestionMark role="img" aria-label="Hinweis" />
            </>
          }
          detailsContent={help}
        />
      )}
    </>
  );
});

export default Input;
