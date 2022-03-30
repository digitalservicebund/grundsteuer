import RadioGroup, { RadioGroupProps } from "./RadioGroup";
import Input, { InputProps } from "./Input";
import Select, { SelectProps } from "./Select";
import SteuerIdField from "./SteuerIdField";
import Checkbox, { CheckboxProps } from "./Checkbox";
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
  error: string;
};

const StepFormField = (props: StepFormFieldProps) => {
  const { name, value, i18n, definition, error } = props;
  const { type, options, defaultValue } = definition;

  const commonProps = {
    name,
    label: i18n.label,
    key: name,
    defaultValue: value || defaultValue,
    error,
  };

  if (type === "radio" && options) {
    const optionsWithLabelsAndHelp = options.map((option) => {
      return {
        ...option,
        label: i18n.options?.[option.value].label || option.value,
        help: i18n.options?.[option.value]?.help,
      };
    });
    const radioProps: RadioGroupProps = {
      ...commonProps,
      options: optionsWithLabelsAndHelp,
    };
    return <RadioGroup {...radioProps} />;
  }

  if (type === "select" && options) {
    const optionsWithLabels = options.map((option) => {
      return {
        ...option,
        label: i18n.options?.[option.value].label || option.value,
      };
    });
    const selectProps: SelectProps = {
      ...commonProps,
      options: optionsWithLabels,
      help: i18n.help,
    };
    return <Select {...selectProps} />;
  }

  if (type === "checkbox") {
    const checkboxProps: CheckboxProps = {
      ...commonProps,
      help: i18n.help,
    };

    return <Checkbox {...checkboxProps} />;
  }

  const textProps: InputProps = {
    ...commonProps,
    placeholder: i18n.placeholder,
    help: i18n.help,
  };

  if (type === "steuerId") {
    return <SteuerIdField {...textProps} />;
  }
  return <Input {...textProps} />;
};

export default StepFormField;
