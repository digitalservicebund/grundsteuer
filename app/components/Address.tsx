import { ConfigStepField } from "~/domain";
import { StepTextField } from "~/components/index";
import { StepFormData } from "~/domain/model";
import _ from "lodash";

export default function Address({
  fields,
  formData,
}: {
  fields: ConfigStepField[];
  formData: StepFormData;
}) {
  const fieldMap = _.keyBy(fields, (field) => field.name);

  const strasse: ConfigStepField = fieldMap["strasse"];
  const hausnummer = fieldMap["hausnummer"];
  const zusatzangaben = fieldMap["zusatzangaben"];
  const postfach = fieldMap["postfach"];
  const plz = fieldMap["postfach"];
  const ort = fieldMap["ort"];

  return (
    <>
      <StepTextField config={strasse} value={formData?.[strasse.name]} />
      <StepTextField config={hausnummer} value={formData?.[hausnummer.name]} />
      <StepTextField
        config={zusatzangaben}
        value={formData?.[zusatzangaben.name]}
      />
      <StepTextField config={postfach} value={formData?.[postfach.name]} />
      <StepTextField config={plz} value={formData?.[plz.name]} />
      <StepTextField config={ort} value={formData?.[ort.name]} />
    </>
  );
}
