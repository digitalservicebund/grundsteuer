import React from "react";
import classNames from "classnames";
import Label from "./Label";
import FieldError from "./FieldError";

export interface TextareaProps
  extends React.ComponentPropsWithoutRef<"textarea"> {
  name: string;
  value?: string;
  label?: string;
  error?: string;
  defaultValue?: string;
  placeholder?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    const { className, label, error, name, id, ...inputProps } = props;

    const labelComponent = label && (
      <Label id={id || name} disabled={inputProps.disabled}>
        {label}
      </Label>
    );

    const textareaComponent = (
      <textarea
        {...inputProps}
        ref={ref}
        name={name}
        id={id || name}
        rows={3}
        className={classNames(
          "block w-full h-[240px] resize-none",
          "bg-white text-black",
          "border-2 border-blue-800",
          "hover:outline hover:outline-4 hover:outline-blue-800 hover:outline-offset-[-4px]",
          "focus:outline focus:outline-4 focus:outline-blue-800 focus:outline-offset-[-4px]",
          "disabled:!text-gray-600 disabled:!border-gray-600 disabled:!outline-none",
          "p-24 text-18 leading-24",
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
        {labelComponent}
        {textareaComponent}
        {errorComponent}
      </>
    );
  }
);

export default Textarea;
