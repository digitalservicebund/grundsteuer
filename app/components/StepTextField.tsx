import { Label, Input } from "@digitalservice4germany/digital-service-library";

export type StepTextFieldProps = {
  name: string;
  label: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
};

export default function StepTextField(props: StepTextFieldProps) {
  const { name, label, value, defaultValue, placeholder } = props;
  const id = name;
  return (
    <>
      <Label htmlFor={id} className="block">
        {label}
      </Label>
      <Input
        type="text"
        name={name}
        id={id}
        defaultValue={value || defaultValue}
        className="mb-4"
        placeholder={placeholder}
      />
    </>
  );
}
