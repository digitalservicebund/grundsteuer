import QuestionMark from "~/components/icons/mui/QuestionMark";
import Details from "~/components/Details";
import classNames from "classnames";
import FieldError from "./FieldError";
import React from "react";
import { FormGroup } from "~/components";

export type CheckboxProps = {
  name: string;
  label: string;
  help?: string;
  value?: string;
  defaultValue?: string;
  error?: string;
};

export default function Checkbox(props: CheckboxProps) {
  const { name, label, help, defaultValue, error } = props;

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
        "before:left-0 before:top-0 before:border-2 before:border-green-900",
        "before:inline-block before:align-middle before:mr-8",
        `before:peer-checked:bg-blue-500`
      )}
    >
      {label}
    </label>
  );

  const errorComponent = error && <FieldError>{error}</FieldError>;

  if (help) {
    return (
      <FormGroup>
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
      </FormGroup>
    );
  } else {
    return (
      <FormGroup>
        {inputComponent}
        {labelComponent}
        {errorComponent}
      </FormGroup>
    );
  }
}
