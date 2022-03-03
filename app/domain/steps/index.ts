import _ from "lodash";

import {
  gebaeudeAb1949,
  GebaeudeAb1949Fields,
} from "~/domain/steps/gebaeude/ab1949";

import {
  gebaeudeBaujahr,
  GebaeudeBaujahrFields,
} from "~/domain/steps/gebaeude/baujahr";

import {
  gebaeudeKernsaniert,
  GebaeudeKernsaniertFields,
} from "~/domain/steps/gebaeude/kernsaniert";

import {
  gebaeudeKernsanierungsjahr,
  GebaeudeKernsanierungsjahrFields,
} from "~/domain/steps/gebaeude/kernsanierungsjahr";

import {
  gebaeudeWohnflaeche,
  GebaeudeWohnflaecheFields,
} from "~/domain/steps/gebaeude/wohnflaeche";
import {
  gebaeudeWohnflaechen,
  GebaeudeWohnflaechenFields,
} from "~/domain/steps/gebaeude/wohnflaechen";
import {
  GebaeudeWeitereWohnraeumeFields,
  gebaeudeWeitereWohnraeume,
} from "~/domain/steps/gebaeude/weitereWohnraeume";
import {
  gebaeudeWeitereWohnraeumeFlaeche,
  GebaeudeWeitereWohnraeumeFlaecheFields,
} from "~/domain/steps/gebaeude/weitereWohnraeumeFlaeche";
import {
  GebaeudeGaragenFields,
  gebaeudeGaragen,
} from "~/domain/steps/gebaeude/garagen";

import {
  eigentuemerAnzahl,
  EigentuemerAnzahlFields,
} from "~/domain/steps/eigentuemer/anzahl";

export type { EigentuemerAnzahlFields };

import {
  eigentuemerPersonAdresse,
  EigentuemerPersonAdresseFields,
} from "~/domain/steps/eigentuemer/person/adresse";

import {
  eigentuemerPersonAnteil,
  EigentuemerPersonAnteilFields,
} from "~/domain/steps/eigentuemer/person/anteil";

import {
  eigentuemerPersonGesetzlicherVertreter,
  EigentuemerPersonGesetzlicherVertreterFields,
} from "~/domain/steps/eigentuemer/person/gesetzlicherVertreter";

export type { EigentuemerPersonGesetzlicherVertreterFields };

import {
  eigentuemerPersonPersoenlicheAngaben,
  EigentuemerPersonPersoenlicheAngabenFields,
} from "~/domain/steps/eigentuemer/person/persoenlicheAngaben";

import {
  eigentuemerPersonSteuerId,
  EigentuemerPersonSteuerIdFields,
} from "~/domain/steps/eigentuemer/person/steuerId";

import {
  eigentuemerPersonTelefonnummer,
  EigentuemerPersonTelefonnummerFields,
} from "~/domain/steps/eigentuemer/person/telefonnummer";

import {
  eigentuemerPersonVertreterAdresse,
  EigentuemerPersonVertreterAdresseFields,
} from "~/domain/steps/eigentuemer/person/vertreter/adresse";

import {
  eigentuemerPersonVertreterName,
  EigentuemerPersonVertreterNameFields,
} from "~/domain/steps/eigentuemer/person/vertreter/name";

import {
  eigentuemerPersonVertreterTelefonnummer,
  EigentuemerPersonVertreterTelefonnummerFields,
} from "~/domain/steps/eigentuemer/person/vertreter/telefonnummer";

import {
  eigentuemerVerheiratet,
  EigentuemerVerheiratetFields,
} from "~/domain/steps/eigentuemer/verheiratet";

import {
  gebaeudeGaragenAnzahl,
  GebaeudeGaragenAnzahlFields,
} from "~/domain/steps/gebaeude/garagenAnzahl";

import {
  grundstueckAdresse,
  GrundstueckAdresseFields,
} from "./grundstueck/adresse";
export type { GrundstueckAdresseFields };

import {
  grundstueckSteuernummer,
  GrundstueckSteuernummerFields,
} from "./grundstueck/steuernummer";
export type { GrundstueckSteuernummerFields };

import { grundstueckTyp, GrundstueckTypFields } from "./grundstueck/typ";
export type { GrundstueckTypFields };

import {
  grundstueckUnbebaut,
  GrundstueckUnbebautFields,
} from "./grundstueck/unbebaut";
export type { GrundstueckUnbebautFields };

import {
  grundstueckGemeinde,
  GrundstueckGemeindeFields,
} from "./grundstueck/gemeinde";
export type { GrundstueckGemeindeFields };

import {
  grundstueckAnzahl,
  GrundstueckAnzahlFields,
} from "./grundstueck/anzahl";
export type { GrundstueckAnzahlFields };

import {
  grundstueckFlurstueckAngaben,
  GrundstueckFlurstueckAngabenFields,
} from "./grundstueck/flurstueck/angaben";
export type { GrundstueckFlurstueckAngabenFields };

import {
  grundstueckBodenrichtwert,
  GrundstueckBodenrichtwertFields,
} from "./grundstueck/bodenrichtwert";
export type { GrundstueckBodenrichtwertFields };

const stepDefinitions = {
  grundstueck: {
    adresse: grundstueckAdresse,
    steuernummer: grundstueckSteuernummer,
    typ: grundstueckTyp,
    unbebaut: grundstueckUnbebaut,
    gemeinde: grundstueckGemeinde,
    anzahl: grundstueckAnzahl,
    bodenrichtwert: grundstueckBodenrichtwert,
    flurstueck: {
      angaben: grundstueckFlurstueckAngaben,
    },
  },
  gebaeude: {
    ab1949: gebaeudeAb1949,
    baujahr: gebaeudeBaujahr,
    garagen: gebaeudeGaragen,
    garagenAnzahl: gebaeudeGaragenAnzahl,
    kernsaniert: gebaeudeKernsaniert,
    kernsanierungsjahr: gebaeudeKernsanierungsjahr,
    weitereWohnraeume: gebaeudeWeitereWohnraeume,
    weitereWohnraeumeFlaeche: gebaeudeWeitereWohnraeumeFlaeche,
    wohnflaeche: gebaeudeWohnflaeche,
    wohnflaechen: gebaeudeWohnflaechen,
  },
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
};

export default stepDefinitions;

export type Flurstueck<T = GrundstueckFlurstueckAngabenFields> = {
  angaben?: T;
};

export type GrundModel = {
  grundstueck?: {
    adresse?: GrundstueckAdresseFields;
    steuernummer?: GrundstueckSteuernummerFields;
    typ?: GrundstueckTypFields;
    unbebaut?: GrundstueckUnbebautFields;
    gemeinde?: GrundstueckGemeindeFields;
    anzahl?: GrundstueckAnzahlFields;
    bodenrichtwert?: GrundstueckBodenrichtwertFields;
    flurstueck?: Flurstueck[];
  };
  gebaeude?: {
    ab1949?: GebaeudeAb1949Fields;
    baujahr?: GebaeudeBaujahrFields;
    garagen?: GebaeudeGaragenFields;
    garagenAnzahl?: GebaeudeGaragenAnzahlFields;
    kernsaniert?: GebaeudeKernsaniertFields;
    kernsanierungsjahr?: GebaeudeKernsanierungsjahrFields;
    weitereWohnraeume?: GebaeudeWeitereWohnraeumeFields;
    weitereWohnraeumeFlaeche?: GebaeudeWeitereWohnraeumeFlaecheFields;
    wohnflaeche?: GebaeudeWohnflaecheFields;
    wohnflaechen?: GebaeudeWohnflaechenFields;
  };
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
