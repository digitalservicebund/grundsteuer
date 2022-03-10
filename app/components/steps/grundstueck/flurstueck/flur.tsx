import type { StepComponentFunction } from "~/routes/formular/_step";
import { StepFormField } from "~/components";
import { GrundstueckFlurstueckFlurFields } from "~/domain/steps";
import slashIcon from "../../../../../public/icons/slash.svg";

const GrundstueckFlurstueckFlur: StepComponentFunction = ({
  stepDefinition,
  formData,
  i18n,
}) => {
  const fieldDefinitions =
    stepDefinition.fields as GrundstueckFlurstueckFlurFields;

  const fieldNames = Object.keys(fieldDefinitions);
  const fieldProps = fieldNames.map((fieldName) => {
    return {
      name: fieldName,
      value: formData?.[fieldName],
      i18n: i18n.fields[fieldName],
      definition:
        fieldDefinitions[fieldName as keyof GrundstueckFlurstueckFlurFields],
    };
  });
  return (
    <div>
      <StepFormField {...fieldProps[0]} />
      <fieldset className="flex-row">
        <StepFormField {...fieldProps[1]} />
        <img
          className="inline-block px-10 h-40 mb-4"
          alt="Schrägstrich"
          src={slashIcon}
        />
        <StepFormField {...fieldProps[2]} />
      </fieldset>
      <fieldset className="flex-row">
        <StepFormField {...fieldProps[3]} />
        <img
          className="inline-block px-10 h-40 mb-4"
          alt="Schrägstrich"
          src={slashIcon}
        />
        <StepFormField {...fieldProps[4]} />
      </fieldset>
    </div>
  );
};

export default GrundstueckFlurstueckFlur;
