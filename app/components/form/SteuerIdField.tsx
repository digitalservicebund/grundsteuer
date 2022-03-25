import { InputProps } from "./Input";
import MaskedInput from "./MaskedInput";

export default function SteuerIdField(props: InputProps) {
  return <MaskedInput {...props} mask={"00 000 000 000"} />;
}
