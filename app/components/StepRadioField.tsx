import { ConfigStepFieldRadio, ConfigStepFieldOptionsItem } from "~/domain";

export default function StepRadioField({
  config,
  value,
}: {
  config: ConfigStepFieldRadio;
  value?: string;
}) {
  const { name, label, options } = config;

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
