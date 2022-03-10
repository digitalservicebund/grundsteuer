import StepTextField, { StepTextFieldProps } from "~/components/StepTextField";
import StepRadioField, {
  StepRadioFieldProps,
} from "~/components/StepRadioField";
import StepSelectField, {
  StepSelectFieldProps,
} from "~/components/StepSelectField";

export type StepFormFieldProps = {
  name: string;
  value?: string;
  i18n: {
    label: string;
    options?: Record<string, string>;
  };
  definition: {
    type?: string;
    defaultValue?: string;
    options?: { value: string }[];
    placeholder?: string;
  };
};

const StepFormField = (props: StepFormFieldProps) => {
  const { name, value, i18n, definition } = props;
  const { type, options, defaultValue, placeholder } = definition;

  const commonProps = {
    name,
    value,
    label: i18n.label,
    key: name,
    defaultValue,
  };

  if (type && ["radio", "select"].includes(type) && options) {
    const optionsWithLabels = options.map((option) => {
      return { ...option, label: i18n.options?.[option.value] || option.value };
    });

    if (type === "select") {
      const selectProps: StepSelectFieldProps = {
        ...commonProps,
        options: optionsWithLabels,
      };
      return <StepSelectField {...selectProps} />;
    }
    const radioProps: StepRadioFieldProps = {
      ...commonProps,
      options: optionsWithLabels,
    };
    return <StepRadioField {...radioProps} />;
  }

  const textProps: StepTextFieldProps = {
    ...commonProps,
    placeholder,
  };
  return <StepTextField {...textProps} />;
};

export default StepFormField;
