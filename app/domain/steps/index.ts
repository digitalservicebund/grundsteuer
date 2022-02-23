import _ from "lodash";

import eigentuemerAnzahl from "./eigentuemer/anzahl";
import eigentuemerPersonAdresse from "./eigentuemer/person/adresse";
import eigentuemerPersonAnteil from "./eigentuemer/person/anteil";
import eigentuemerPersonGesetzlicherVertreter from "./eigentuemer/person/gesetzlicherVertreter";
import eigentuemerPersonName from "./eigentuemer/person/name";
import eigentuemerPersonSteuerId from "./eigentuemer/person/steuerId";
import eigentuemerPersonTelefonnummer from "./eigentuemer/person/telefonnummer";
import eigentuemerPersonVertreterAdresse from "./eigentuemer/person/vertreter/adresse";
import eigentuemerPersonVertreterName from "./eigentuemer/person/vertreter/name";
import eigentuemerPersonVertreterTelefonnummer from "./eigentuemer/person/vertreter/telefonnummer";
import eigentuemerVerheiratet from "./eigentuemer/verheiratet";
import grundstueck from "./grundstueck";

const stepDefinitions = {
  eigentuemer: {
    anzahl: eigentuemerAnzahl,
    person: {
      adresse: eigentuemerPersonAdresse,
      anteil: eigentuemerPersonAnteil,
      gesetzlicherVertreter: eigentuemerPersonGesetzlicherVertreter,
      name: eigentuemerPersonName,
      steuerId: eigentuemerPersonSteuerId,
      telefonnummer: eigentuemerPersonTelefonnummer,
      vertreter: {
        adresse: eigentuemerPersonVertreterAdresse,
        name: eigentuemerPersonVertreterName,
        telefonnummer: eigentuemerPersonVertreterTelefonnummer,
      },
    },
    verheiratet: eigentuemerVerheiratet,
  },
  grundstueck: grundstueck,
};

export default stepDefinitions;

export type StepDefinitionField = {
  validations: any;
};

export type StepDefinitionFieldWithOptions = StepDefinitionField & {
  type: "radio" | "select";
  options: { value: string }[];
};

export type StepDefinition = {
  fields: Record<string, StepDefinitionField | StepDefinitionFieldWithOptions>;
};

export const getStepDefinition = ({
  currentStateWithoutId,
}: {
  currentStateWithoutId: string;
}): StepDefinition => {
  return _.get(stepDefinitions, currentStateWithoutId);
};
