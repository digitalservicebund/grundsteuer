import Default from "./default";
import BodenrichtwertAnzahl from "~/components/steps/grundstueck/BodenrichtwertAnzahl";
import BodenrichtwertEingabe from "~/components/steps/grundstueck/BodenrichtwertEingabe";
import BodenrichtwertInfo from "~/components/steps/grundstueck/BodenrichtwertInfo";
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
import GrundstueckUebersicht from "~/components/steps/grundstueck/uebersicht";
import GebaeudeUebersicht from "~/components/steps/gebaeude/uebersicht";
import { EmpfangsbevollmaechtigterNameHelp } from "~/components/steps/eigentuemer/empfangsbevollmaechtigter/name";
import EigentuemerUebersicht from "~/components/steps/eigentuemer/uebersicht";
import EigentuemerAbschluss from "~/components/steps/eigentuemer/abschluss";
import GrundstueckFlurstueckGroesse from "~/components/steps/grundstueck/flurstueck/groesse";

export { Default as FallbackStepComponent };

export default {
  welcome: Welcome,
  eigentuemer: {
    uebersicht: EigentuemerUebersicht,
    bruchteilsgemeinschaft: Bruchteilsgemeinschaft,
    bruchteilsgemeinschaftangaben: {
      angaben: EigentuemerBruchteilsgemeinschaftAngaben,
    },
    abschluss: EigentuemerAbschluss,
  },
  grundstueck: {
    uebersicht: GrundstueckUebersicht,
    bodenrichtwertInfo: BodenrichtwertInfo,
    bodenrichtwertEingabe: BodenrichtwertEingabe,
    bodenrichtwertAnzahl: BodenrichtwertAnzahl,

    flurstueck: {
      angaben: GrundstueckFlurstueckAngaben,
      flur: GrundstueckFlurstueckFlur,
      groesse: GrundstueckFlurstueckGroesse,
    },
  },
  gebaeude: {
    uebersicht: GebaeudeUebersicht,
  },
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
    empfangsbevollmaechtigter: {
      name: EmpfangsbevollmaechtigterNameHelp,
    },
  },
};
