import { Label, Input } from "@digitalservice4germany/digital-service-library";
import { ConfigStepFieldText } from "~/domain";

export default function StepTextField({
  config,
  value,
}: {
  config: ConfigStepFieldText;
  value?: string;
}) {
  const { name, label } = config;
  const id = name;
  return (
    <>
      <Label htmlFor={id} className="block">
        {label}
      </Label>
      <Input type="text" name={name} id={id} defaultValue={value} />
    </>
  );
}
