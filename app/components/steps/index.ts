import Adresse from "./eigentuemer/person/adresse";
import Anteil from "./eigentuemer/person/anteil";
import VertreterAdresse from "./eigentuemer/person/vertreter/adresse";
import Debug from "./debug";
import Default from "./default";
import Bodenrichtwert from "~/components/steps/grundstueck/bodenrichtwert";
import GrundstueckFlurstueckAngaben, {
  GrundstueckFlurstueckAngabenHelp,
} from "./grundstueck/flurstueck/angaben";
import GrundstueckFlurstueckFlur from "~/components/steps/grundstueck/flurstueck/flur";
import { SteuernummerHelp } from "~/components/steps/grundstueck/steuernummer";
import { AbweichendeEntwicklungHelp } from "~/components/steps/grundstueck/abweichendeEntwicklung";
import Bruchteilsgemeinschaft, {
  BruchteilsgemeinschaftHelp,
} from "~/components/steps/eigentuemer/bruchteilsgemeinschaft";
import EigentuemerBruchteilsgemeinschaftAngaben from "~/components/steps/eigentuemer/bruchteilsgemeinschaftangaben/angaben";
import Welcome from "~/components/steps/welcome";

export { Default as FallbackStepComponent };

export default {
  welcome: Welcome,
  eigentuemer: {
    person: {
      adresse: Adresse,
      anteil: Anteil,
      vertreter: {
        adresse: VertreterAdresse,
      },
    },
    bruchteilsgemeinschaft: Bruchteilsgemeinschaft,
    bruchteilsgemeinschaftangaben: {
      angaben: EigentuemerBruchteilsgemeinschaftAngaben,
    },
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
    abweichendeEntwicklung: AbweichendeEntwicklungHelp,
    flurstueck: {
      angaben: GrundstueckFlurstueckAngabenHelp,
    },
  },
  eigentuemer: {
    bruchteilsgemeinschaft: BruchteilsgemeinschaftHelp,
  },
};
