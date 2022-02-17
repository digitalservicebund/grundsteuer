import { useActionData, useLoaderData } from "remix";
import { ConfigStepField } from "~/domain";
import { render } from "~/routes/steps/_step";
import Address from "~/components/Address";

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

    <Address fields={personAdresseFields} formData={formData} />
  );
}
