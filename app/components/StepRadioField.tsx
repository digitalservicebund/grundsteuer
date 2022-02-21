import { ConfigStepFieldOptionsItem } from "~/domain";

export type StepRadioFieldProps = {
  name: string;
  value: string | undefined;
  label: string;
  options: { value: string; label: string }[];
};

export default function StepRadioField(props: StepRadioFieldProps) {
  const { name, label, value, options } = props;

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
        <label htmlFor={optionId}>{option.label}</label>
      </div>
    );
  };

  return (
    <fieldset>
      <legend>{label}</legend>
      {options.map((option) => {
        const checked = option.value === value;

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
