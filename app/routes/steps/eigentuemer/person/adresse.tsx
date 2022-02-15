import { useActionData, useLoaderData } from "remix";
import { ConfigStepField } from "~/domain";
import { StepTextField } from "~/components";
import { render } from "~/routes/steps/_step";

export { action, loader, handle } from "~/routes/steps/_step";

const headline = "Adresse";

export const streetAddress: ConfigStepField = {
  name: "strasse",
  label: "Straße / Lagebezeichnung",
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
  label: "Hausnummer (+Hausnummerzusatz)",
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

export const zusatzangaben: ConfigStepField = {
  name: "zusatzangaben",
  label: "Zusatzangaben (bswp. Hinterhaus)",
  validations: {},
};

export const postfach: ConfigStepField = {
  name: "postfach",
  label: "Postfach",
  validations: {},
};

export const plz: ConfigStepField = {
  name: "plz",
  label: "PLZ",
  validations: {},
};

export const ort: ConfigStepField = {
  name: "ort",
  label: "Ort",
  validations: {},
};

export default function Adresse() {
  const { formData } = useLoaderData();
  const actionData = useActionData();

  return render(
    actionData,
    headline,

    <>
      <StepTextField
        config={streetAddress}
        value={formData?.[streetAddress.name]}
      />
      <StepTextField config={hausnummer} value={formData?.[hausnummer.name]} />
      <StepTextField
        config={zusatzangaben}
        value={formData?.[zusatzangaben.name]}
      />
      <StepTextField config={postfach} value={formData?.[postfach.name]} />
      <StepTextField config={plz} value={formData?.[plz.name]} />
      <StepTextField config={ort} value={formData?.[ort.name]} />
    </>
  );
}
