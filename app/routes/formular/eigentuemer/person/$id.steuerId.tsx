import { useActionData, useLoaderData } from "remix";
import { ConfigStepField } from "~/domain";
import { StepTextField } from "~/components";
import { render } from "~/routes/formular/_step";

export { action, loader, handle } from "~/routes/formular/_step";

const steuerId: ConfigStepField = {
  name: "steuerId",
  validations: {},
};

export const personSteuerIdFields = [steuerId];

export default function SteuerId() {
  const { formData, i18n } = useLoaderData();
  const actionData = useActionData();

  personSteuerIdFields.forEach((field) => {
    field.label = i18n[field.name];
  });

  return render(
    actionData,
    i18n.headline,
    <>
      <StepTextField config={steuerId} value={formData?.[steuerId.name]} />
    </>
  );
}
