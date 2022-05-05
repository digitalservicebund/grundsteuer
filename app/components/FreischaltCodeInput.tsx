import { IMaskMixin } from "react-imask";
import invariant from "tiny-invariant";
import { ReactElement } from "react-imask/dist/mixin";
import Input, { InputProps } from "./form/Input";

const InputWithMixin = IMaskMixin<
  IMask.AnyMaskedOptions,
  false,
  string,
  ReactElement
>(({ inputRef, ...props }) => {
  const { name, value, defaultValue, ...rest } = props;
  invariant(typeof name == "string");
  invariant(typeof value == "string" || typeof value == "undefined");
  invariant(
    typeof defaultValue == "string" || typeof defaultValue == "undefined"
  );
  return (
    <Input
      {...{ ...rest, name, defaultValue: value || defaultValue, ref: inputRef }}
    />
  );
});

export default function FreischaltCodeInput(props: InputProps) {
  return (
    <InputWithMixin
      mask="FFFF-FFFF-FFFF"
      definitions={{
        F: /[0-9A-Z]/,
      }}
      prepare={(str: string) => str.toUpperCase()}
      {...props}
    />
  );
}
