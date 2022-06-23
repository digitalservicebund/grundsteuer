import { ConfigStepFieldOptionsItem } from "~/domain";
import FieldError from "./FieldError";
import RadioButtonBild from "~/components/form/RadioButtonBild";
import {
  StepDefinitionField,
  StepDefinitionFieldWithOptions,
} from "~/domain/steps";
import { I18nObjectField } from "~/i18n/getStepI18n";
import invariant from "tiny-invariant";
import { ReactElement } from "react";
import { getHelpComponent } from "~/components/form/help";
import Help from "~/components/form/help/Help";

export type RadioWithImageGroupProps = {
  name: string;
  label?: string;
  options: {
    value: string;
    label: string;
    help?: ReactElement;
    image: string;
    imageAltText: string;
  }[];
  value?: string;
  defaultValue?: string;
  error?: string;
};

const RadioGroupOption = (
  option: ConfigStepFieldOptionsItem & {
    name: string;
    checked: boolean;
    image: string;
    imageAltText: string;
    help?: ReactElement;
  }
) => {
  const radioComponent = (
    <RadioButtonBild
      defaultChecked={option.checked}
      name={option.name}
      value={option.value}
      image={option.image}
      imageAltText={option.imageAltText}
    >
      {option.label}
    </RadioButtonBild>
  );

  return (
    <div key={option.value} data-testid={`option-${option.value}`}>
      {radioComponent}
      {option.help && <Help>{option.help}</Help>}
    </div>
  );
};

export default function RadioWithImageGroup(props: RadioWithImageGroupProps) {
  const { name, label, options, value, defaultValue, error } = props;

  const errorComponent = error && <FieldError>{error}</FieldError>;

  const radioGroupComponent = (
    <>
      {options.map((option, index) => {
        const checked = value
          ? option.value === value
          : option.value === defaultValue;
        return (
          <div
            key={option.value}
            className={index + 1 < options.length ? "mb-16" : ""}
          >
            <RadioGroupOption
              {...{
                name,
                checked,
                image: option.image,
                imageAltText: option.imageAltText,
                value: option.value,
                label: option.label,
                help: option.help,
              }}
            />
          </div>
        );
      })}
      {errorComponent}
    </>
  );

  if (label) {
    return (
      <fieldset>
        <legend>{label}</legend>
        {radioGroupComponent}
      </fieldset>
    );
  }

  return radioGroupComponent;
}
export const extractRadioWithImageGroupProps = (
  fieldProps: {
    name: string;
    definition: StepDefinitionField;
    error: string | undefined;
    value: any;
    i18n: I18nObjectField;
  },
  imagesAndAltTexts: { image: string; imageAltText: string }[],
  pathToStep: string
) => {
  const commonProps = {
    name: fieldProps.name,
    label: fieldProps.i18n.label,
    key: fieldProps.name,
    defaultValue: fieldProps.value,
    error: fieldProps.error,
    ...fieldProps.definition.htmlAttributes,
  };

  const options = (fieldProps.definition as StepDefinitionFieldWithOptions)
    .options;
  const optionsWithImages = [];

  invariant(
    options.length <= imagesAndAltTexts.length,
    "Expected at least on image per option to exist"
  );
  for (let i = 0; i < options.length; ++i) {
    const option = options[i];
    const image = imagesAndAltTexts[i];
    optionsWithImages.push({ ...option, ...image });
  }
  const optionsWithLabelsAndHelp = optionsWithImages.map((option) => {
    const optionI18n = fieldProps.i18n.options?.[option.value];
    const helpComponent = getHelpComponent({
      path: pathToStep + "." + fieldProps.name + "." + option.value,
      helpText: optionI18n?.help,
    });
    return {
      ...option,
      label: optionI18n?.label || option.value,
      help: helpComponent,
    };
  });
  return {
    ...commonProps,
    options: optionsWithLabelsAndHelp,
  };
};
