import { Label } from "@digitalservice4germany/digital-service-library";
import { ConfigStepFieldOptionsItem } from "~/domain";

export type StepSelectFieldProps = {
  name: string;
  value: string | undefined;
  label: string;
  options: { value: string; label: string }[];
};

export default function StepSelectField(props: StepSelectFieldProps) {
  const { name, label, value, options } = props;
  const id = name;

  const renderSelectFieldOption = (option: ConfigStepFieldOptionsItem) => {
    return (
      <option value={option.value} key={option.value}>
        {option.label}
      </option>
    );
  };

  return (
    <>
      <Label htmlFor={id} className="block">
        {label}
      </Label>
      <select name={name} id={id} defaultValue={value}>
        {options.map(renderSelectFieldOption)}
      </select>
    </>
  );
}
