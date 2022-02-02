import { Label } from "@digitalservice4germany/digital-service-library";
import { ConfigStepFieldSelect, ConfigStepFieldOptionsItem } from "~/domain";

export default function StepSelectField({
  config,
  value,
}: {
  config: ConfigStepFieldSelect;
  value?: string;
}) {
  const { name, label, options } = config;
  const id = name;

  const renderSelectFieldOption = ({
    value,
    label,
  }: ConfigStepFieldOptionsItem & { name: string }) => {
    return (
      <option value={value} key={value}>
        {label}
      </option>
    );
  };

  return (
    <>
      <Label htmlFor={id} className="block">
        {label}
      </Label>
      <select name={name} id={id} defaultValue={value}>
        {options.map((item: ConfigStepFieldOptionsItem) =>
          renderSelectFieldOption({
            name,
            value: item.value,
            label: item.label,
          })
        )}
      </select>
    </>
  );
}
