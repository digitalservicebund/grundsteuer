import { IMaskMixin } from "react-imask";
import StepTextField, { StepTextFieldProps } from "~/components/StepTextField";
import invariant from "tiny-invariant";
import { ReactElement } from "react-imask/dist/mixin";

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
    <StepTextField {...{ ...rest, name, value, defaultValue, ref: inputRef }} />
  );
});

export type MaskedInputProps = StepTextFieldProps & {
  mask: string;
};

export default function MaskedInput(props: MaskedInputProps) {
  return <InputWithMixin {...props} />;
}
