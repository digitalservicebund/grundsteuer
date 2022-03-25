import { Label } from "@digitalservice4germany/digital-service-library";
import { ConfigStepFieldOptionsItem } from "~/domain";
import Details from "~/components/Details";
import QuestionMark from "~/components/icons/mui/QuestionMark";
import React from "react";

export type StepSelectFieldProps = {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  help?: string;
  value?: string;
  defaultValue?: string;
};

export default function StepSelectField(props: StepSelectFieldProps) {
  const { name, label, options, help, value, defaultValue } = props;
  const id = name;

  const renderSelectFieldOption = (option: ConfigStepFieldOptionsItem) => {
    return (
      <option value={option.value} key={option.value}>
        {option.label}
      </option>
    );
  };

  const labelComponent = (
    <Label htmlFor={id} className="block">
      {label}
    </Label>
  );
  const fieldComponent = (
    <select name={name} id={id} defaultValue={value || defaultValue}>
      <option disabled selected>
        -
      </option>
      {options.map(renderSelectFieldOption)}
    </select>
  );

  if (help) {
    return (
      <>
        <Details
          summaryContent={
            <>
              <div className="flex justify-between">
                {labelComponent}
                <QuestionMark role="img" aria-label="Hinweis" />
              </div>
              {fieldComponent}
            </>
          }
          detailsContent={<p>{help}</p>}
        />
      </>
    );
  } else {
    return (
      <>
        {labelComponent}
        {fieldComponent}
      </>
    );
  }
}
