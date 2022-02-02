import { ConfigStepFieldRadio, ConfigStepFieldOptionsItem } from "~/domain";

export default function StepRadioField({
  config,
  value,
}: {
  config: ConfigStepFieldRadio;
  value?: string;
}) {
  const { name, label, options } = config;

  const renderRadioFieldOption = ({
    name,
    value,
    label,
    checkedValue,
  }: ConfigStepFieldOptionsItem & { name: string; checkedValue: string }) => {
    const id = `${name}-${value}`;
    const checked = checkedValue === value;
    return (
      <div key={value}>
        <input
          defaultChecked={checked}
          type="radio"
          name={name}
          value={value}
          id={id}
        />
        <label htmlFor={id}>{label}</label>
      </div>
    );
  };

  return (
    <fieldset>
      <legend>{label}</legend>
      {options.map((item) =>
        renderRadioFieldOption({
          name,
          value: item.value,
          label: item.label,
          checkedValue: value || "",
        })
      )}
    </fieldset>
  );
}
