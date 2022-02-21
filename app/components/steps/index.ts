import Adresse from "./eigentuemer/person/adresse";
import Anteil from "./eigentuemer/person/anteil";
import VertreterAdresse from "./eigentuemer/person/vertreter/adresse";
import Debug from "./debug";
import Default from "./default";

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
  gebaeude: Debug,
};
