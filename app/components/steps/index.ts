import Adresse from "./eigentuemer/person/adresse";
import Anteil from "./eigentuemer/person/anteil";
import VertreterAdresse from "./eigentuemer/person/vertreter/adresse";
import Debug from "./debug";
import Default from "./default";
import Bodenrichtwert from "~/components/steps/grundstueck/bodenrichtwert";

export { Default as FallbackStepComponent };

export default {
  eigentuemer: {
    person: {
      adresse: Adresse,
      anteil: Anteil,
      vertreter: {
        adresse: VertreterAdresse,
      },
    },
  },
  grundstueck: {
    bodenrichtwert: Bodenrichtwert,
  },
  gebaeude: Debug,
};
