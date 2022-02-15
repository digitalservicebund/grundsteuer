import { useActionData, useLoaderData } from "remix";
import { ConfigStepField } from "~/domain";
import { StepTextField } from "~/components";
import { render } from "~/routes/steps/_step";

export { action, loader, handle } from "./../../_step";

const headline = "";

export default function Telefonnummer() {
  const { formData } = useLoaderData();
  const actionData = useActionData();

  const telefonnummer: ConfigStepField = {
    name: "telefonnummer",
    label: "Telefonnummer",
    validations: {},
  };

  return render(
    actionData,
    headline,
    <>
      <StepTextField
        config={telefonnummer}
        value={formData?.[telefonnummer.name]}
      />
    </>
  );
}
