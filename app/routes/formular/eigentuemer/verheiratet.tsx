import { useActionData, useLoaderData } from "remix";
import { ConfigStepField } from "~/domain";
import { StepRadioField } from "~/components";
import { render } from "~/routes/formular/_step";

export { action, loader, handle } from "./../_step";

const headline = "Anzahl Eigentümer";

export default function Anzahl() {
  const { formData } = useLoaderData();
  const actionData = useActionData();

  const areVerheiratet: ConfigStepField = {
    name: "areVerheiratet",
    label: "Sind die Eigentümer:innen verheiratet?",
    validations: {},
    options: [
      {
        value: "true",
        label: "Ja",
      },
      {
        value: "false",
        label: "Nein",
      },
    ],
  };

  return render(
    actionData,
    headline,
    <>
      <StepRadioField
        config={areVerheiratet}
        value={formData?.[areVerheiratet.name]}
      />
    </>
  );
}
