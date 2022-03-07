import { ConfigStepFieldOptionsItem } from "~/domain";

export type StepRadioFieldProps = {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  value?: string;
  defaultValue?: string;
};

export default function StepRadioField(props: StepRadioFieldProps) {
  const { name, label, options, value, defaultValue } = props;

  const renderRadioFieldOption = (
    option: ConfigStepFieldOptionsItem & { name: string; checked: boolean }
  ) => {
    const optionId = `${option.name}-${option.value}`;
    return (
      <div key={option.value}>
        <input
          defaultChecked={option.checked}
          type="radio"
          name={option.name}
          value={option.value}
          id={optionId}
        />
        <label htmlFor={optionId} className="ml-2">
          {option.label}
        </label>
      </div>
    );
  };

  return (
    <fieldset className="mb-4">
      <legend>{label}</legend>
      {options.map((option) => {
        const checked = value
          ? option.value === value
          : option.value === defaultValue;

        return renderRadioFieldOption({
          name,
          checked,
          value: option.value,
          label: option.label,
        });
      })}
    </fieldset>
  );
}
