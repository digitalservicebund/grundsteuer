import { ConfigStepField } from "~/domain";
import { StepTextField } from "~/components/index";
import { StepFormData } from "~/domain/model";
import _ from "lodash";

export default function Name({
  fields,
  formData,
}: {
  fields: ConfigStepField[];
  formData: StepFormData;
}) {
  const fieldMap = _.keyBy(fields, (field) => field.name);

  const anrede: ConfigStepField = fieldMap["anrede"];
  const titel = fieldMap["titel"];
  const name = fieldMap["name"];
  const vorname = fieldMap["vorname"];

  return (
    <>
      <StepTextField config={anrede} value={formData?.[anrede.name]} />
      <StepTextField config={titel} value={formData?.[titel.name]} />
      <StepTextField config={name} value={formData?.[name.name]} />
      <StepTextField config={vorname} value={formData?.[vorname.name]} />
    </>
  );
}
