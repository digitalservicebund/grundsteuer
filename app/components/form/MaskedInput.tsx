import { IMaskMixin } from "react-imask";
import invariant from "tiny-invariant";
import Input, { InputProps } from "./Input";

const InputWithMixin = IMaskMixin<
  IMask.AnyMaskedOptions,
  false,
  string,
  HTMLInputElement
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

export type MaskedInputProps = InputProps & {
  mask: string;
  definitions?: Record<string, RegExp>;
  prepare?: (arg0: string) => string;
};

export default function MaskedInput(props: MaskedInputProps) {
  const { mask, ...rest } = props;
  if (mask === "Date") {
    return <InputWithMixin mask={Date} {...rest} />;
  }
  return <InputWithMixin mask={mask} {...rest} />;
}
