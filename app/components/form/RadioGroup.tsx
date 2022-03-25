import { ConfigStepFieldOptionsItem } from "~/domain";
import Details from "../Details";
import QuestionMark from "~/components/icons/mui/QuestionMark";

export type RadioGroupProps = {
  name: string;
  label: string;
  options: { value: string; label: string; help?: string }[];
  value?: string;
  defaultValue?: string;
};

const RadioGroupOption = (
  option: ConfigStepFieldOptionsItem & {
    name: string;
    checked: boolean;
    help?: string;
    key: string;
  }
) => {
  const optionId = `${option.name}-${option.value}`;

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
        <Details
          summaryContent={
            <>
              {inputComponent}
              {labelComponent}
              <QuestionMark
                className="inline-block float-right"
                role="img"
                aria-label="Hinweis"
              />
            </>
          }
          detailsContent={<p>{option.help}</p>}
        />
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

export default function RadioGroup(props: RadioGroupProps) {
  const { name, label, options, value, defaultValue } = props;

  return (
    <fieldset className="mb-4">
      <legend>{label}</legend>
      {options.map((option) => {
        const checked = value
          ? option.value === value
          : option.value === defaultValue;

        return (
          <RadioGroupOption
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
