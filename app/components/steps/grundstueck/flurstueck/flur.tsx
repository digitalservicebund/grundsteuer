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
  const flurFieldName = "flur";
  const flurstueckZaehlerName = "flurstueckZaehler";
  const flurstueckNennerName = "flurstueckNenner";
  const anteilZaehlerName = "wirtschaftlicheEinheitZaehler";
  const anteilNennerName = "wirtschaftlicheEinheitNenner";
  return (
    <div>
      <StepFormField
        {...{
          name: flurFieldName,
          value: formData?.[flurFieldName],
          i18n: i18n.fields[flurFieldName],
          definition: fieldDefinitions.flur,
        }}
      />
      <fieldset className="flex-row">
        <StepFormField
          {...{
            name: flurstueckZaehlerName,
            value: formData?.[flurstueckZaehlerName],
            i18n: i18n.fields[flurstueckZaehlerName],
            definition: fieldDefinitions.flurstueckZaehler,
            className: "inline-block",
          }}
        />
        <img
          className="inline-block px-10 h-40 mb-4"
          alt="Schrägstrich"
          src={slashIcon}
        />
        <StepFormField
          {...{
            name: flurstueckNennerName,
            value: formData?.[flurstueckNennerName],
            i18n: i18n.fields[flurstueckNennerName],
            definition: fieldDefinitions.flurstueckNenner,
            className: "inline-block",
          }}
        />
      </fieldset>
      <fieldset className="flex-row">
        <StepFormField
          {...{
            name: anteilZaehlerName,
            value: formData?.[anteilZaehlerName],
            i18n: i18n.fields[anteilZaehlerName],
            definition: fieldDefinitions.wirtschaftlicheEinheitZaehler,
            className: "inline-block",
          }}
        />
        <img
          className="inline-block px-10 h-40 mb-4"
          alt="Schrägstrich"
          src={slashIcon}
        />
        <StepFormField
          {...{
            name: anteilNennerName,
            value: formData?.[anteilNennerName],
            i18n: i18n.fields[anteilNennerName],
            definition: fieldDefinitions.wirtschaftlicheEinheitNenner,
            className: "inline-block",
          }}
        />
      </fieldset>
    </div>
  );
};

export default GrundstueckFlurstueckFlur;
