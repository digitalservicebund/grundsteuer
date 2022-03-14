import { ConfigStepFieldOptionsItem } from "~/domain";
import { useState } from "react";
import QuestionMark from "~/components/icons/mui/QuestionMark";

export type StepRadioFieldProps = {
  name: string;
  label: string;
  options: { value: string; label: string; help?: string }[];
  value?: string;
  defaultValue?: string;
};

const StepRadioFieldOption = (
  option: ConfigStepFieldOptionsItem & {
    name: string;
    checked: boolean;
    help?: string;
    key: string;
  }
) => {
  const optionId = `${option.name}-${option.value}`;
  const [helpExpanded, setHelpExpanded] = useState(false);

  const inputComponent = (
    <input
      defaultChecked={option.checked}
      type="radio"
      name={option.name}
      value={option.value}
      id={optionId}
    />
  );
  const labelComponent = (
    <label htmlFor={optionId} className="ml-2">
      {option.label}
    </label>
  );

  if (option.help) {
    return (
      <div key={option.value} data-testid={`option-${option.value}`}>
        <details onToggle={() => setHelpExpanded(!helpExpanded)}>
          <summary
            className="list-none"
            role="button"
            aria-expanded={helpExpanded}
            tabIndex={0}
            data-testid="help-summary"
          >
            {inputComponent}
            {labelComponent}
            <QuestionMark
              className="inline-block float-right"
              role="img"
              aria-label="Hinweis"
            />
          </summary>
          <div className="bg-blue-200 p-16 mb-4">
            <p>{option.help}</p>
          </div>
        </details>
      </div>
    );
  } else {
    return (
      <div key={option.value} data-testid={`option-${option.value}`}>
        {inputComponent}
        {labelComponent}
      </div>
    );
  }
};

export default function StepRadioField(props: StepRadioFieldProps) {
  const { name, label, options, value, defaultValue } = props;

  return (
    <fieldset className="mb-4">
      <legend>{label}</legend>
      {options.map((option) => {
        const checked = value
          ? option.value === value
          : option.value === defaultValue;

        return (
          <StepRadioFieldOption
            {...{
              name,
              checked,
              value: option.value,
              label: option.label,
              help: option.help,
              key: option.value,
            }}
          />
        );
      })}
    </fieldset>
  );
}
