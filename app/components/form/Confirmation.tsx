import classNames from "classnames";
import FieldError from "./FieldError";
import React from "react";
import { FormGroup } from "~/components";

export type ConfirmationProps = {
  name: string;
  label: string;
  help?: string;
  value?: string;
  defaultValue?: string;
  error?: string;
};

export default function Confirmation(props: ConfirmationProps) {
  const { name, label, defaultValue, error } = props;

  const inputComponent = (
    <input
      defaultChecked={!!defaultValue}
      type="checkbox"
      name={name}
      value="true"
      id={name}
      className="opacity-0 absolute h-32 w-32 peer"
    />
  );
  const labelComponent = (
    <label
      htmlFor={name}
      className={classNames(
        "before:content-[''] before:w-32 before:h-32",
        "before:top-0 before:border-2 before:border-green-900",
        "before:inline-block before:align-middle before:mr-8",
        "before:absolute before:top-0 before:left-[-32px]",
        "before:bg-white",
        "before:peer-checked:bg-blue-500",
        "relative block ml-32 pl-8"
      )}
    >
      {label}
    </label>
  );

  const errorComponent = error && <FieldError>{error}</FieldError>;
  return (
    <FormGroup>
      <div className="bg-gray-400 p-16">
        {inputComponent}
        {labelComponent}
        {errorComponent}
      </div>
    </FormGroup>
  );
}
