import { useActionData, useLoaderData } from "remix";
import { ConfigStepField } from "~/domain";
import { StepTextField } from "~/components";
import { render } from "~/routes/steps/_step";

export { action, loader, handle } from "~/routes/steps/_step";

const telefonnummer: ConfigStepField = {
  name: "telefonnummer",
  validations: {},
};

export const personTelefonnummerFields = [telefonnummer];

export default function Telefonnummer() {
  const { formData, i18n } = useLoaderData();
  const actionData = useActionData();

  personTelefonnummerFields.forEach((field) => {
    field.label = i18n[field.name];
  });

  return render(
    actionData,
    i18n.headline,
    <>
      <StepTextField
        config={telefonnummer}
        value={formData?.[telefonnummer.name]}
      />
    </>
  );
}
