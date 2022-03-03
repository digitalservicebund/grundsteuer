import React from "react";
import { Label, Input } from "@digitalservice4germany/digital-service-library";

export type StepTextFieldProps = {
  name: string;
  value: string | undefined;
  label: string;
};

export default function StepTextField(props: StepTextFieldProps) {
  const { name, label, value } = props;
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
        defaultValue={value}
        className="mb-4"
      />
    </>
  );
}
