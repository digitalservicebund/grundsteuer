import FieldError from "./FieldError";
import Radio from "./Radio";
import { ReactElement } from "react";
import Help from "~/components/form/help/Help";
import { Trans } from "react-i18next";

export type RadioOptionProps = {
  value: string;
  label: string;
  checked?: boolean;
  help?: ReactElement;
  description?: string;
};

export type RadioGroupProps = {
  name: string;
  label?: string;
  options: RadioOptionProps[];
  value?: string;
  defaultValue?: string;
  error?: string;
};

const RadioGroupOption = (option: RadioOptionProps & { name: string }) => {
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
        <Trans components={{ bold: <strong /> }}>{option.label}</Trans>
      )}
    </Radio>
  );

  return (
    <div key={option.value} data-testid={`option-${option.value}`}>
      {radioComponent}
      {option.help && (
        <Help summaryClassNames={"ml-[48px]"}>{option.help}</Help>
      )}
    </div>
  );
};

export default function RadioGroup(props: RadioGroupProps) {
  const { name, label, options, value, defaultValue, error } = props;

  const errorComponent = error && (
    <FieldError className="!mt-32">{error}</FieldError>
  );

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
