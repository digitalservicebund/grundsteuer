import _ from "lodash";

import eigentuemerAnzahl, {
  EigentuemerAnzahlFields,
} from "./eigentuemer/anzahl";
export type { EigentuemerAnzahlFields };

import eigentuemerPersonAdresse, {
  EigentuemerPersonAdresseFields,
} from "./eigentuemer/person/adresse";

import eigentuemerPersonAnteil, {
  EigentuemerPersonAnteilFields,
} from "./eigentuemer/person/anteil";

import eigentuemerPersonGesetzlicherVertreter, {
  EigentuemerPersonGesetzlicherVertreterFields,
} from "./eigentuemer/person/gesetzlicherVertreter";
export type { EigentuemerPersonGesetzlicherVertreterFields };

import eigentuemerPersonPersoenlicheAngaben, {
  EigentuemerPersonPersoenlicheAngabenFields,
} from "./eigentuemer/person/persoenlicheAngaben";

import eigentuemerPersonSteuerId, {
  EigentuemerPersonSteuerIdFields,
} from "./eigentuemer/person/steuerId";

import eigentuemerPersonTelefonnummer, {
  EigentuemerPersonTelefonnummerFields,
} from "./eigentuemer/person/telefonnummer";

import eigentuemerPersonVertreterAdresse, {
  EigentuemerPersonVertreterAdresseFields,
} from "./eigentuemer/person/vertreter/adresse";

import eigentuemerPersonVertreterName, {
  EigentuemerPersonVertreterNameFields,
} from "./eigentuemer/person/vertreter/name";

import eigentuemerPersonVertreterTelefonnummer, {
  EigentuemerPersonVertreterTelefonnummerFields,
} from "./eigentuemer/person/vertreter/telefonnummer";

import eigentuemerVerheiratet, {
  EigentuemerVerheiratetFields,
} from "./eigentuemer/verheiratet";

import grundstueck, { GrundstueckFields } from "./grundstueck";
export type { GrundstueckFields };

const stepDefinitions = {
  eigentuemer: {
    anzahl: eigentuemerAnzahl,
    person: {
      adresse: eigentuemerPersonAdresse,
      anteil: eigentuemerPersonAnteil,
      gesetzlicherVertreter: eigentuemerPersonGesetzlicherVertreter,
      persoenlicheAngaben: eigentuemerPersonPersoenlicheAngaben,
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

export type GrundModel = {
  eigentuemer?: {
    anzahl?: EigentuemerAnzahlFields;
    person?: {
      adresse?: EigentuemerPersonAdresseFields;
      anteil?: EigentuemerPersonAnteilFields;
      gesetzlicherVertreter?: EigentuemerPersonGesetzlicherVertreterFields;
      persoenlicheAngaben?: EigentuemerPersonPersoenlicheAngabenFields;
      steuerId?: EigentuemerPersonSteuerIdFields;
      telefonnummer?: EigentuemerPersonTelefonnummerFields;
      vertreter?: {
        adresse?: EigentuemerPersonVertreterAdresseFields;
        name?: EigentuemerPersonVertreterNameFields;
        telefonnummer?: EigentuemerPersonVertreterTelefonnummerFields;
      };
    }[];
    verheiratet?: EigentuemerVerheiratetFields;
  };
  grundstueck?: GrundstueckFields;
};

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
