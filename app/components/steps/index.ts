import Adresse from "./eigentuemer/person/adresse";
import Anteil from "./eigentuemer/person/anteil";
import VertreterAdresse from "./eigentuemer/person/vertreter/adresse";
import Debug from "./debug";
import Default from "./default";
import Bodenrichtwert from "~/components/steps/grundstueck/bodenrichtwert";
import Freitext from "~/components/steps/eigentuemer/freitext";
import GrundstueckFlurstueckAngaben from "./grundstueck/flurstueck/angaben";
import GrundstueckFlurstueckFlur from "~/components/steps/grundstueck/flurstueck/flur";
import { SteuernummerHelp } from "~/components/steps/grundstueck/steuernummer";

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
    freitext: Freitext,
  },
  grundstueck: {
    bodenrichtwert: Bodenrichtwert,
    flurstueck: {
      angaben: GrundstueckFlurstueckAngaben,
      flur: GrundstueckFlurstueckFlur,
    },
  },
  gebaeude: Debug,
};

export const helpComponents = {
  grundstueck: {
    steuernummer: SteuernummerHelp,
  },
};
