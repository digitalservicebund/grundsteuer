import { ConfigStepFieldOptionsItem } from "~/domain";
import Details from "../Details";
import QuestionMark from "~/components/icons/mui/QuestionMark";
import FieldError from "./FieldError";
import Radio from "./Radio";
import { ReactElement } from "react";

export type RadioGroupProps = {
  name: string;
  label?: string;
  options: {
    value: string;
    label: string;
    help?: ReactElement;
    description?: string;
  }[];
  value?: string;
  defaultValue?: string;
  error?: string;
};

const RadioGroupOption = (
  option: ConfigStepFieldOptionsItem & {
    name: string;
    checked: boolean;
    help?: ReactElement;
    description?: string;
  }
) => {
  const radioComponent = (
    <Radio
      defaultChecked={option.checked}
      name={option.name}
      value={option.value}
    >
      {option.description !== undefined ? (
        <>
          <span className="block font-bold">{option.label}</span>
          <span>{option.description}</span>
        </>
      ) : (
        option.label
      )}
    </Radio>
  );

  return (
    <div key={option.value} data-testid={`option-${option.value}`}>
      {radioComponent}
      {option.help && (
        <Details
          summaryContent={<QuestionMark role="img" aria-label="Hinweis" />}
          detailsContent={option.help}
        />
      )}
    </div>
  );
};

export default function RadioGroup(props: RadioGroupProps) {
  const { name, label, options, value, defaultValue, error } = props;

  const errorComponent = error && <FieldError>{error}</FieldError>;

  const radioGroupComponent = (
    <>
      {options.map((option, index) => {
        const checked = value
          ? option.value === value
          : option.value === defaultValue;

        return (
          <div
            key={option.value}
            className={index + 1 < options.length ? "mb-24" : ""}
          >
            <RadioGroupOption
              {...{
                name,
                checked,
                value: option.value,
                label: option.label,
                help: option.help,
                description: option.description,
              }}
            />
          </div>
        );
      })}
      {errorComponent}
    </>
  );

  if (label) {
    return (
      <fieldset>
        <legend>{label}</legend>
        {radioGroupComponent}
      </fieldset>
    );
  }

  return radioGroupComponent;
}
