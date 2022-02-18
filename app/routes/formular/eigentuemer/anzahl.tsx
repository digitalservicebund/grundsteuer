import { useActionData, useLoaderData } from "remix";
import { ConfigStepField } from "~/domain";
import { StepTextField } from "~/components";
import { render } from "~/routes/formular/_step";

export { action, loader, handle } from "./../_step";

const headline = "Anzahl Eigentümer";

export default function Anzahl() {
  const { formData } = useLoaderData();
  const actionData = useActionData();

  const anzahl: ConfigStepField = {
    name: "anzahl",
    label: "Anzahl",
    validations: {},
  };

  return render(
    actionData,
    headline,
    <>
      <StepTextField config={anzahl} value={formData?.[anzahl.name]} />
    </>
  );
}
