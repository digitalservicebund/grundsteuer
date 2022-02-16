import { useActionData, useLoaderData } from "remix";
import { ConfigStepField } from "~/domain";
import { StepTextField } from "~/components";
import { render } from "~/routes/steps/_step";

export { action, loader, handle } from "~/routes/steps/_step";

const strasse: ConfigStepField = {
  name: "strasse",
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

const hausnummer: ConfigStepField = {
  name: "hausnummer",
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

const zusatzangaben: ConfigStepField = {
  name: "zusatzangaben",
  validations: {},
};

const postfach: ConfigStepField = {
  name: "postfach",
  validations: {},
};

const plz: ConfigStepField = {
  name: "plz",
  validations: {},
};

const ort: ConfigStepField = {
  name: "ort",
  validations: {},
};

export const personAdresseFields: ConfigStepField[] = [
  strasse,
  hausnummer,
  zusatzangaben,
  postfach,
  plz,
  ort,
];

export default function Adresse() {
  const { formData, i18n } = useLoaderData();
  const actionData = useActionData();

  personAdresseFields.forEach((field) => {
    field.label = i18n[field.name];
  });

  return render(
    actionData,
    i18n.headline,

    <>
      <StepTextField config={strasse} value={formData?.[strasse.name]} />
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
