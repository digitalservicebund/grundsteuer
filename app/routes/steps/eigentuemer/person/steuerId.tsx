import { useActionData, useLoaderData } from "remix";
import { ConfigStepField } from "~/domain";
import { StepTextField } from "~/components";
import { render } from "~/routes/steps/_step";

export { action, loader, handle } from "./../../_step";

const headline = "";

export default function SteuerId() {
  const { formData } = useLoaderData();
  const actionData = useActionData();

  const steuerId: ConfigStepField = {
    name: "steuerId",
    label: "Steuer-ID",
    validations: {},
  };

  return render(
    actionData,
    headline,
    <>
      <StepTextField config={steuerId} value={formData?.[steuerId.name]} />
    </>
  );
}
