import { StepTextFieldProps } from "~/components/StepTextField";
import MaskedInput from "~/components/MaskedInput";

export default function SteuerIdField(props: StepTextFieldProps) {
  return <MaskedInput {...props} mask={"00 000 000 000"} />;
}
