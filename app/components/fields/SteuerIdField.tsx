import { InputProps } from "~/components/Input";
import MaskedInput from "~/components/MaskedInput";

export default function SteuerIdField(props: InputProps) {
  return <MaskedInput {...props} mask={"00 000 000 000"} />;
}
