import { Label } from "@digitalservice4germany/digital-service-library";
import classNames from "classnames";
import React from "react";
import QuestionMark from "~/components/icons/mui/QuestionMark";
import Input from "~/components/Input";
import Details from "~/components/Details";

export type StepTextFieldProps = {
  name: string;
  label?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  help?: string;
};

const StepTextField = React.forwardRef<HTMLInputElement, StepTextFieldProps>(
  (props, ref) => {
    const { name, label, value, defaultValue, placeholder, help } = props;
    const id = name;

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
        ref={ref}
      />
    );

    if (help) {
      return (
        <Details
          summaryContent={
            <>
              <div className="flex-row">
                {labelComponent}
                <QuestionMark
                  className="inline-block float-right"
                  role="img"
                  aria-label="Hinweis"
                />
              </div>
              {inputComponent}
            </>
          }
          detailsContent={<p>{help}</p>}
        />
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
);

export default StepTextField;
