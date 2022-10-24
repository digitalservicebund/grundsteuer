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

export type { EigentuemerPersonAdresseFields };
import {
  eigentuemerPersonAnteil,
  EigentuemerPersonAnteilFields,
} from "~/domain/steps/eigentuemer/person/anteil";

export type { EigentuemerPersonAnteilFields };
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
  Bundesland,
} from "./grundstueck/adresse.server";

export type { GrundstueckAdresseFields, Bundesland };

import {
  grundstueckSteuernummer,
  GrundstueckSteuernummerFields,
} from "./grundstueck/steuernummer.server";

export type { GrundstueckSteuernummerFields };

import { grundstueckTyp, GrundstueckTypFields } from "./grundstueck/typ.server";

export type { GrundstueckTypFields };

import {
  grundstueckAbweichendeEntwicklung,
  GrundstueckAbweichendeEntwicklungFields,
} from "./grundstueck/abweichendeEntwicklung.server";

export type { GrundstueckAbweichendeEntwicklungFields };

import {
  grundstueckGemeinde,
  GrundstueckGemeindeFields,
} from "./grundstueck/gemeinde.server";

export type { GrundstueckGemeindeFields };

import {
  grundstueckAnzahl,
  GrundstueckAnzahlFields,
} from "./grundstueck/anzahl.server";

export type { GrundstueckAnzahlFields };

import {
  grundstueckFlurstueckAngaben,
  GrundstueckFlurstueckAngabenFields,
} from "./grundstueck/flurstueck/angaben.server";

export type { GrundstueckFlurstueckAngabenFields };

import {
  grundstueckFlurstueckFlur,
  GrundstueckFlurstueckFlurFields,
} from "./grundstueck/flurstueck/flur.server";

export type { GrundstueckFlurstueckFlurFields };

import {
  grundstueckFlurstueckGroesse,
  GrundstueckFlurstueckGroesseFields,
} from "./grundstueck/flurstueck/groesse.server";

export type { GrundstueckFlurstueckGroesseFields };

import {
  grundstueckBodenrichtwertEingabe,
  GrundstueckBodenrichtwertEingabeFields,
} from "./grundstueck/bodenrichtwert/eingabe.server";

export type { GrundstueckBodenrichtwertEingabeFields };

import {
  grundstueckBodenrichtwertAnzahl,
  GrundstueckBodenrichtwertAnzahlFields,
} from "~/domain/steps/grundstueck/bodenrichtwert/anzahl.server";

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
} from "~/domain/steps/zusammenfassung.server";

export type { ZusammenfassungFields };
import { ValidationConfig } from "~/domain/validation";

import invariant from "tiny-invariant";
import {
  grundstueckMiteigentumAuswahlHaus,
  GrundstueckMiteigentumAuswahlHausFields,
} from "~/domain/steps/grundstueck/miteigentum/miteigentumAuswahlHaus.server";
export type { GrundstueckMiteigentumAuswahlHausFields };
import {
  grundstueckFlurstueckMiteigentumAuswahl,
  GrundstueckFlurstueckMiteigentumAuswahlFields,
} from "~/domain/steps/grundstueck/flurstueck/miteigentumAuswahl.server";
export type { GrundstueckFlurstueckMiteigentumAuswahlFields };
import {
  grundstueckFlurstueckMiteigentumsanteil,
  GrundstueckFlurstueckMiteigentumsanteilFields,
} from "~/domain/steps/grundstueck/flurstueck/miteigentum.server";

export type { GrundstueckFlurstueckMiteigentumsanteilFields };
import {
  grundstueckMiteigentumAuswahlWohnung,
  GrundstueckMiteigentumAuswahlWohnungFields,
} from "~/domain/steps/grundstueck/miteigentum/miteigentumAuswahlWohnung.server";
import {
  grundstueckMiteigentumGarage,
  GrundstueckMiteigentumGarageFields,
} from "~/domain/steps/grundstueck/miteigentumGarage.server";
export type { GrundstueckMiteigentumGarageFields };

import {
  grundstueckMiteigentumWohnung,
  GrundstueckMiteigentumWohnungFields,
} from "~/domain/steps/grundstueck/miteigentumWohnung.server";
import {
  eigentuemerAbschluss,
  EigentuemerAbschlussFields,
} from "./eigentuemer/abschluss";
export type { GrundstueckMiteigentumWohnungFields };

export const infoStep: StepDefinition = {
  fields: {},
};

const stepDefinitions = {
  welcome: infoStep,
  grundstueck: {
    uebersicht: infoStep,
    adresse: grundstueckAdresse,
    steuernummer: grundstueckSteuernummer,
    typ: grundstueckTyp,
    abweichendeEntwicklung: grundstueckAbweichendeEntwicklung,
    gemeinde: grundstueckGemeinde,
    anzahl: grundstueckAnzahl,
    bodenrichtwertInfo: infoStep,
    bodenrichtwertEingabe: grundstueckBodenrichtwertEingabe,
    bodenrichtwertAnzahl: grundstueckBodenrichtwertAnzahl,
    miteigentumAuswahlHaus: grundstueckMiteigentumAuswahlHaus,
    miteigentumAuswahlWohnung: grundstueckMiteigentumAuswahlWohnung,
    miteigentumWohnung: grundstueckMiteigentumWohnung,
    miteigentumGarage: grundstueckMiteigentumGarage,
    flurstueck: {
      angaben: grundstueckFlurstueckAngaben,
      flur: grundstueckFlurstueckFlur,
      groesse: grundstueckFlurstueckGroesse,
      miteigentumAuswahl: grundstueckFlurstueckMiteigentumAuswahl,
      miteigentum: grundstueckFlurstueckMiteigentumsanteil,
    },
  },
  gebaeude: {
    uebersicht: infoStep,
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
    uebersicht: infoStep,
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
    abschluss: eigentuemerAbschluss,
  },
  zusammenfassung: zusammenfassung,
};

export default stepDefinitions;

export type Flurstueck = {
  angaben?: GrundstueckFlurstueckAngabenFields;
  flur?: GrundstueckFlurstueckFlurFields;
  groesse?: GrundstueckFlurstueckGroesseFields;
  miteigentumAuswahl?: GrundstueckFlurstueckMiteigentumAuswahlFields;
  miteigentum?: GrundstueckFlurstueckMiteigentumsanteilFields;
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
  grundstueck?: GrundstueckModel;
  gebaeude?: GebaeudeModel;
  eigentuemer?: EigentuemerModel;
  zusammenfassung?: ZusammenfassungFields;
};
export type GrundstueckModel = {
  adresse?: GrundstueckAdresseFields;
  steuernummer?: GrundstueckSteuernummerFields;
  typ?: GrundstueckTypFields;
  abweichendeEntwicklung?: GrundstueckAbweichendeEntwicklungFields;
  gemeinde?: GrundstueckGemeindeFields;
  anzahl?: GrundstueckAnzahlFields;
  bodenrichtwertEingabe?: GrundstueckBodenrichtwertEingabeFields;
  bodenrichtwertAnzahl?: GrundstueckBodenrichtwertAnzahlFields;
  miteigentumAuswahlHaus?: GrundstueckMiteigentumAuswahlHausFields;
  miteigentumAuswahlWohnung?: GrundstueckMiteigentumAuswahlWohnungFields;
  miteigentumWohnung?: GrundstueckMiteigentumWohnungFields;
  miteigentumGarage?: GrundstueckMiteigentumGarageFields;
  flurstueck?: Flurstueck[];
};

export type GebaeudeModel = {
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
export type EigentuemerModel = {
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
  abschluss?: EigentuemerAbschlussFields;
};

export type StepDefinitionField = {
  validations: ValidationConfig;
  htmlAttributes?: Record<string, string | number | boolean>;
  defaultValue?: string;
};

type FieldOptionType =
  | "radio"
  | "select"
  | "checkbox"
  | "textarea"
  | "steuerId"
  | "steuernummer";

type FieldOptions = { value: string; defaultOption?: boolean }[];

export type StepDefinitionFieldWithOptions = StepDefinitionField & {
  type: FieldOptionType;
  options: FieldOptions;
};

export type StepDefinitionFields = StepDefinitionField & {
  type?: FieldOptionType;
  options?: FieldOptions;
};

export type StepDefinition = {
  optional?: boolean;
  fields: Record<string, StepDefinitionField | StepDefinitionFieldWithOptions>;
};

export const getStepDefinition = ({
  currentStateWithoutId,
}: {
  currentStateWithoutId: string;
}): StepDefinition => {
  const definition = _.get(stepDefinitions, currentStateWithoutId);
  invariant(
    definition,
    `No step definition found for ${currentStateWithoutId}.`
  );
  return definition;
};
