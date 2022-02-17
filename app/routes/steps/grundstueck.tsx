import { useActionData, useLoaderData } from "remix";
import { render } from "~/routes/steps/_step";
import { ConfigStepField } from "~/domain";
import { StepRadioField } from "~/components";

export { action, loader, handle } from "./_step";

const headline = "Grundstück";

export default function Grundstueck() {
  const { formData } = useLoaderData();
  const actionData = useActionData();

  const bebaut: ConfigStepField = {
    name: "bebaut",
    label: "Bebaut?",
    validations: {},
    options: [
      {
        value: "ja",
        label: "Ja",
      },
      {
        value: "nein",
        label: "Nein",
      },
    ],
  };

  return render(
    actionData,
    headline,
    <>
      <StepRadioField config={bebaut} value={formData?.[bebaut.name]} />
    </>
  );
}
