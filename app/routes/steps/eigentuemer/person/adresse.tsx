import { useActionData, useLoaderData } from "remix";
import { ConfigStepField } from "~/domain";
import { StepTextField } from "~/components";
import { render } from "~/routes/steps/_step";

export { action, loader, handle } from "./../../_step";

export default function Adresse() {
  const { formData } = useLoaderData();
  const actionData = useActionData();

  const streetAddress: ConfigStepField = {
    name: "strasse",
    label: "Straße",
  };

  const hausnummer: ConfigStepField = {
    name: "hausnummer",
    label: "Hausnummer",
  };

  return render(
    actionData,
    "Adresse",

    <>
      <StepTextField
        config={streetAddress}
        value={formData?.[streetAddress.name]}
      />
      <StepTextField config={hausnummer} value={formData?.[hausnummer.name]} />
      <input type="hidden" name="stepName" value="adresse" />
    </>
  );
}
