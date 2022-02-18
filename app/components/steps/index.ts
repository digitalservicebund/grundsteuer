import { Anzahl, Verheiratet } from "./eigentuemer";
import {
  Adresse,
  Anteil,
  GesetzlicherVertreter,
  PersoenlicheAngaben,
  SteuerId,
  Telefonnummer,
} from "./eigentuemer/person";
import {
  VertreterAdresse,
  VertreterName,
  VertreterTelefonnummer,
} from "./eigentuemer/person/vertreter";
import Grundstueck from "./grundstueck";
import Gebaeude from "./gebaeude";
import Debug from "./debug";

export { Debug as FallbackStepComponent };

export default {
  eigentuemer: {
    anzahl: Anzahl,
    verheiratet: Verheiratet,
    person: {
      adresse: Adresse,
      anteil: Anteil,
      gesetzlicherVertreter: GesetzlicherVertreter,
      persoenlicheAngaben: PersoenlicheAngaben,
      steuerId: SteuerId,
      telefonnummer: Telefonnummer,
      vertreter: {
        adresse: VertreterAdresse,
        name: VertreterName,
        telefonnummer: VertreterTelefonnummer,
      },
    },
  },
  grundstueck: Grundstueck,
  gebaeude: Gebaeude,
};
