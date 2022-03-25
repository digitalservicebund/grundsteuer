import { Label } from "@digitalservice4germany/digital-service-library";
import { ConfigStepFieldOptionsItem } from "~/domain";

export type StepSelectFieldProps = {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  value?: string;
  defaultValue?: string;
};

export default function StepSelectField(props: StepSelectFieldProps) {
  const { name, label, options, value, defaultValue } = props;
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
      <select name={name} id={id} defaultValue={value || defaultValue}>
        <option disabled selected>
          -
        </option>
        {options.map(renderSelectFieldOption)}
      </select>
    </>
  );
}
