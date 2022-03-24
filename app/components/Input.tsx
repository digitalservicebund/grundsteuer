import React from "react";
import classNames from "classnames";

export interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  labelText?: string;
  errorMessage?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className, labelText, errorMessage, name, id, ...inputProps } = props;

  return (
    <>
      {labelText && (
        <label
          htmlFor={id || name}
          className={classNames("block mb-8", {
            "text-gray-600": inputProps.disabled,
          })}
        >
          {labelText}
        </label>
      )}
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
          "px-24 min-h-[4rem] text-18 leading-24",
          {
            "border-red-800 bg-red-200": errorMessage,
          },
          className
        )}
      />
      {errorMessage && <div className="text-red-800 mt-8">{errorMessage}</div>}
    </>
  );
});

export default Input;
