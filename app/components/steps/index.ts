import { Anzahl, Verheiratet } from "./eigentuemer";
import {
  Adresse,
  Anteil,
  GesetzlicherVertreter,
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
import PersonName from "~/components/steps/eigentuemer/person/name";

export { Debug as FallbackStepComponent };

export default {
  eigentuemer: {
    anzahl: Anzahl,
    verheiratet: Verheiratet,
    person: {
      name: PersonName,
      adresse: Adresse,
      anteil: Anteil,
      gesetzlicherVertreter: GesetzlicherVertreter,
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
