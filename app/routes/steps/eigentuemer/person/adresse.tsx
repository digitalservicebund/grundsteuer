import { useActionData, useLoaderData } from "remix";
import { ConfigStepField } from "~/domain";
import { StepTextField } from "~/components";
import { render } from "~/routes/steps/_step";

export { action, loader, handle } from "~/routes/steps/_step";

export const streetAddress: ConfigStepField = {
  name: "strasse",
  label: "Straße",
  validations: {
    requiredIf: {
      dependentField: "hausnummer",
      msg: "musst du eingeben",
    },
    maxLength: {
      param: 12,
      msg: "zu lang",
    },
  },
};

export const hausnummer: ConfigStepField = {
  name: "hausnummer",
  label: "Hausnummer",
  validations: {
    requiredIf: {
      dependentField: "strasse",
      msg: "musst du eingeben",
    },
    maxLength: {
      param: 12,
      msg: "zu lang",
    },
  },
};

export default function Adresse() {
  const { formData } = useLoaderData();
  const actionData = useActionData();

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
