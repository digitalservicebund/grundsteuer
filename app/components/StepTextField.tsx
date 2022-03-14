import { Label, Input } from "@digitalservice4germany/digital-service-library";
import classNames from "classnames";
import { useState } from "react";
import QuestionMark from "~/components/icons/mui/QuestionMark";

export type StepTextFieldProps = {
  name: string;
  label: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  help?: string;
};

export default function StepTextField(props: StepTextFieldProps) {
  const { name, label, value, defaultValue, placeholder, help } = props;
  const id = name;
  const [helpExpanded, setHelpExpanded] = useState(false);

  const labelComponent = (
    <Label htmlFor={id} className={classNames({ block: !help })}>
      {label}
    </Label>
  );
  const inputComponent = (
    <Input
      type="text"
      name={name}
      id={id}
      defaultValue={value || defaultValue}
      className={classNames({ "mb-4": !help })}
      placeholder={placeholder}
    />
  );

  if (help) {
    return (
      <details
        onToggle={() => setHelpExpanded(!helpExpanded)}
        data-testid="help-details"
      >
        <summary
          className="list-none"
          role="button"
          aria-expanded={helpExpanded}
          tabIndex={0}
          data-testid="help-summary"
        >
          <div className="flex-row">
            {labelComponent}
            <QuestionMark className="inline-block float-right" role="img" />
          </div>
          {inputComponent}
        </summary>
        <div className="bg-blue-200 p-16 mb-4">
          <p>{help}</p>
        </div>
      </details>
    );
  } else {
    return (
      <>
        {labelComponent}
        {inputComponent}
      </>
    );
  }
}
