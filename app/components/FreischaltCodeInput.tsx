import { InputProps } from "./form/Input";
import MaskedInput from "~/components/form/MaskedInput";

export default function FreischaltCodeInput(props: InputProps) {
  return (
    <MaskedInput
      mask="FFFF-FFFF-FFFF"
      definitions={{
        F: /[0-9A-Z]/,
      }}
      prepare={(str: string) => str.toUpperCase()}
      {...props}
    />
  );
}
