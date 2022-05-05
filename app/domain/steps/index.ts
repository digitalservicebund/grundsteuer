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
  gebaeudeWeitereWohnraeumeDetails,
  GebaeudeWeitereWohnraeumeDetailsFields,
} from "~/domain/steps/gebaeude/weitereWohnraeumeDetails";
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
  eigentuemerPersonVertreterAdresse,
  EigentuemerPersonVertreterAdresseFields,
} from "~/domain/steps/eigentuemer/person/vertreter/adresse";

import {
  eigentuemerPersonVertreterName,
  EigentuemerPersonVertreterNameFields,
} from "~/domain/steps/eigentuemer/person/vertreter/name";

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
  grundstueckAbweichendeEntwicklung,
  GrundstueckAbweichendeEntwicklungFields,
} from "./grundstueck/abweichendeEntwicklung";

export type { GrundstueckAbweichendeEntwicklungFields };

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
  grundstueckFlurstueckFlur,
  GrundstueckFlurstueckFlurFields,
} from "./grundstueck/flurstueck/flur";

export type { GrundstueckFlurstueckFlurFields };

import {
  grundstueckFlurstueckGroesse,
  GrundstueckFlurstueckGroesseFields,
} from "./grundstueck/flurstueck/groesse";

export type { GrundstueckFlurstueckGroesseFields };

import {
  grundstueckBodenrichtwertEingabe,
  GrundstueckBodenrichtwertEingabeFields,
} from "./grundstueck/bodenrichtwert/eingabe";

import {
  grundstueckBodenrichtwertAnzahl,
  GrundstueckBodenrichtwertAnzahlFields,
} from "~/domain/steps/grundstueck/bodenrichtwert/anzahl";

import {
  eigentuemerBruchteilsgemeinschaft,
  EigentuemerBruchteilsgemeinschaftFields,
} from "~/domain/steps/eigentuemer/bruchteilsgemeinschaft";
import {
  eigentuemerEmpfangsvollmacht,
  EigentuemerEmpfangsvollmachtFields,
} from "~/domain/steps/eigentuemer/empfangsvollmacht";
import {
  eigentuemerEmpfangsbevollmaechtigterName,
  EigentuemerEmpfangsbevollmaechtigterNameFields,
} from "~/domain/steps/eigentuemer/empfangsbevollmaechtigter/name";
import {
  eigentuemerEmpfangsbevollmaechtigterAdresse,
  EigentuemerEmpfangsbevollmaechtigterAdresseFields,
} from "~/domain/steps/eigentuemer/empfangsbevollmaechtigter/adresse";
import {
  gebaeudeAbbruchverpflichtung,
  GebaeudeAbbruchverpflichtungFields,
} from "~/domain/steps/gebaeude/abbruchverpflichtung";
import {
  GebaeudeAbbruchverpflichtungsjahrFields,
  gebaeudeAbbruchverpflichtungsjahrjahr,
} from "~/domain/steps/gebaeude/abbruchverpflichtungsjahr";
import {
  eigentuemerBruchteilsgemeinschaftAngaben,
  EigentuemerBruchteilsgemeinschaftAngabenFields,
} from "~/domain/steps/eigentuemer/bruchteilsgemeinschaftangaben/angaben";
import {
  zusammenfassung,
  ZusammenfassungFields,
} from "~/domain/steps/zusammenfassung";
import { ValidationConfig } from "~/domain/validation";
import {
  GrundstueckFlurstueckMiteigentumFields,
  grundstuecklurstueckMiteigentum,
} from "~/domain/steps/grundstueck/flurstueck/miteingentum";
import {
  grundstueckFlurstueckMiteigentumsanteil,
  GrundstueckFlurstueckMiteigentumsanteilFields,
} from "~/domain/steps/grundstueck/flurstueck/miteigentumsanteil";

export type { GrundstueckBodenrichtwertEingabeFields };

const stepDefinitions = {
  grundstueck: {
    adresse: grundstueckAdresse,
    steuernummer: grundstueckSteuernummer,
    typ: grundstueckTyp,
    abweichendeEntwicklung: grundstueckAbweichendeEntwicklung,
    gemeinde: grundstueckGemeinde,
    anzahl: grundstueckAnzahl,
    bodenrichtwertEingabe: grundstueckBodenrichtwertEingabe,
    bodenrichtwertAnzahl: grundstueckBodenrichtwertAnzahl,
    flurstueck: {
      angaben: grundstueckFlurstueckAngaben,
      flur: grundstueckFlurstueckFlur,
      miteigentum: grundstuecklurstueckMiteigentum,
      miteigentumsanteil: grundstueckFlurstueckMiteigentumsanteil,
      groesse: grundstueckFlurstueckGroesse,
    },
  },
  gebaeude: {
    ab1949: gebaeudeAb1949,
    abbruchverpflichtung: gebaeudeAbbruchverpflichtung,
    abbruchverpflichtungsjahr: gebaeudeAbbruchverpflichtungsjahrjahr,
    baujahr: gebaeudeBaujahr,
    garagen: gebaeudeGaragen,
    garagenAnzahl: gebaeudeGaragenAnzahl,
    kernsaniert: gebaeudeKernsaniert,
    kernsanierungsjahr: gebaeudeKernsanierungsjahr,
    weitereWohnraeume: gebaeudeWeitereWohnraeume,
    weitereWohnraeumeDetails: gebaeudeWeitereWohnraeumeDetails,
    wohnflaeche: gebaeudeWohnflaeche,
    wohnflaechen: gebaeudeWohnflaechen,
  },
  eigentuemer: {
    anzahl: eigentuemerAnzahl,
    verheiratet: eigentuemerVerheiratet,
    person: {
      adresse: eigentuemerPersonAdresse,
      anteil: eigentuemerPersonAnteil,
      gesetzlicherVertreter: eigentuemerPersonGesetzlicherVertreter,
      persoenlicheAngaben: eigentuemerPersonPersoenlicheAngaben,
      steuerId: eigentuemerPersonSteuerId,
      vertreter: {
        adresse: eigentuemerPersonVertreterAdresse,
        name: eigentuemerPersonVertreterName,
      },
    },
    bruchteilsgemeinschaft: eigentuemerBruchteilsgemeinschaft,
    bruchteilsgemeinschaftangaben: {
      angaben: eigentuemerBruchteilsgemeinschaftAngaben,
    },
    empfangsvollmacht: eigentuemerEmpfangsvollmacht,
    empfangsbevollmaechtigter: {
      name: eigentuemerEmpfangsbevollmaechtigterName,
      adresse: eigentuemerEmpfangsbevollmaechtigterAdresse,
    },
  },
  zusammenfassung: zusammenfassung,
};

export default stepDefinitions;

export type Flurstueck = {
  angaben?: GrundstueckFlurstueckAngabenFields;
  flur?: GrundstueckFlurstueckFlurFields;
  miteigentum?: GrundstueckFlurstueckMiteigentumFields;
  miteigentumsanteil?: GrundstueckFlurstueckMiteigentumsanteilFields;
  groesse?: GrundstueckFlurstueckGroesseFields;
};

export type Person = {
  adresse?: EigentuemerPersonAdresseFields;
  anteil?: EigentuemerPersonAnteilFields;
  gesetzlicherVertreter?: EigentuemerPersonGesetzlicherVertreterFields;
  persoenlicheAngaben?: EigentuemerPersonPersoenlicheAngabenFields;
  steuerId?: EigentuemerPersonSteuerIdFields;
  vertreter?: {
    adresse?: EigentuemerPersonVertreterAdresseFields;
    name?: EigentuemerPersonVertreterNameFields;
  };
};

export type GrundModel = {
  welcome?: object;
  grundstueck?: {
    adresse?: GrundstueckAdresseFields;
    steuernummer?: GrundstueckSteuernummerFields;
    typ?: GrundstueckTypFields;
    abweichendeEntwicklung?: GrundstueckAbweichendeEntwicklungFields;
    gemeinde?: GrundstueckGemeindeFields;
    anzahl?: GrundstueckAnzahlFields;
    bodenrichtwertEingabe?: GrundstueckBodenrichtwertEingabeFields;
    bodenrichtwertAnzahl?: GrundstueckBodenrichtwertAnzahlFields;
    flurstueck?: Flurstueck[];
  };
  gebaeude?: {
    ab1949?: GebaeudeAb1949Fields;
    abbruchverpflichtung?: GebaeudeAbbruchverpflichtungFields;
    abbruchverpflichtungsjahr?: GebaeudeAbbruchverpflichtungsjahrFields;
    baujahr?: GebaeudeBaujahrFields;
    garagen?: GebaeudeGaragenFields;
    garagenAnzahl?: GebaeudeGaragenAnzahlFields;
    kernsaniert?: GebaeudeKernsaniertFields;
    kernsanierungsjahr?: GebaeudeKernsanierungsjahrFields;
    weitereWohnraeume?: GebaeudeWeitereWohnraeumeFields;
    weitereWohnraeumeDetails?: GebaeudeWeitereWohnraeumeDetailsFields;
    wohnflaeche?: GebaeudeWohnflaecheFields;
    wohnflaechen?: GebaeudeWohnflaechenFields;
  };
  eigentuemer?: {
    anzahl?: EigentuemerAnzahlFields;
    verheiratet?: EigentuemerVerheiratetFields;
    person?: Person[];
    bruchteilsgemeinschaft?: EigentuemerBruchteilsgemeinschaftFields;
    bruchteilsgemeinschaftangaben?: {
      angaben?: EigentuemerBruchteilsgemeinschaftAngabenFields;
    };
    empfangsvollmacht?: EigentuemerEmpfangsvollmachtFields;
    empfangsbevollmaechtigter?: {
      name?: EigentuemerEmpfangsbevollmaechtigterNameFields;
      adresse?: EigentuemerEmpfangsbevollmaechtigterAdresseFields;
    };
  };
  zusammenfassung?: ZusammenfassungFields;
};

export type StepDefinitionField = {
  validations: ValidationConfig;
};

export type StepDefinitionFieldWithOptions = StepDefinitionField & {
  type: "radio" | "select" | "checkbox" | "steuerId" | "confirmation";
  options: { value: string; defaultOption?: boolean }[];
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
