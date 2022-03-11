import StepTextField, { StepTextFieldProps } from "~/components/StepTextField";
import StepRadioField, {
  StepRadioFieldProps,
} from "~/components/StepRadioField";
import StepSelectField, {
  StepSelectFieldProps,
} from "~/components/StepSelectField";
import { I18nObjectField } from "~/routes/formular/_step";

export type StepFormFieldProps = {
  name: string;
  value?: string;
  i18n: I18nObjectField;
  definition: {
    type?: string;
    defaultValue?: string;
    options?: { value: string }[];
  };
};

const StepFormField = (props: StepFormFieldProps) => {
  const { name, value, i18n, definition } = props;
  const { type, options, defaultValue } = definition;

  const commonProps = {
    name,
    value,
    label: i18n.label,
    key: name,
    defaultValue,
  };

  if (type === "radio" && options) {
    const optionsWithLabelsAndHelp = options.map((option) => {
      return {
        ...option,
        label: i18n.options?.[option.value].label || option.value,
        help: i18n.options?.[option.value]?.help,
      };
    });
    const radioProps: StepRadioFieldProps = {
      ...commonProps,
      options: optionsWithLabelsAndHelp,
    };
    return <StepRadioField {...radioProps} />;
  }

  if (type === "select" && options) {
    const optionsWithLabels = options.map((option) => {
      return {
        ...option,
        label: i18n.options?.[option.value].label || option.value,
      };
    });
    const selectProps: StepSelectFieldProps = {
      ...commonProps,
      options: optionsWithLabels,
    };
    return <StepSelectField {...selectProps} />;
  }

  const textProps: StepTextFieldProps = {
    ...commonProps,
    placeholder: i18n.placeholder,
    help: i18n.help,
  };
  return <StepTextField {...textProps} />;
};

export default StepFormField;
