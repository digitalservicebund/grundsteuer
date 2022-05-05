import Default from "~/components/steps/Default";
import BodenrichtwertAnzahl from "~/components/steps/grundstueck/BodenrichtwertAnzahl";
import BodenrichtwertEingabe from "~/components/steps/grundstueck/BodenrichtwertEingabe";
import BodenrichtwertInfo from "~/components/steps/grundstueck/BodenrichtwertInfo";
import FlurstueckAngaben, {
  GrundstueckFlurstueckAngabenHelp,
} from "~/components/steps/grundstueck/flurstueck/FlurstueckAngaben";
import FlurstueckFlur from "~/components/steps/grundstueck/flurstueck/FlurstueckFlur";
import FlurstueckMiteigentumsanteil from "~/components/steps/grundstueck/flurstueck/FlurstueckMiteigentumsanteil";
import FlurstueckMiteigentum from "~/components/steps/grundstueck/flurstueck/FlurstueckMiteigentum";
import FlurstueckGroesse from "~/components/steps/grundstueck/flurstueck/FlurstueckGroesse";
import { SteuernummerHelp } from "~/components/steps/grundstueck/SteuernummerHelp";
import { AbweichendeEntwicklungHelp } from "~/components/steps/grundstueck/AbweichendeEntwicklungHelp";
import Bruchteilsgemeinschaft from "~/components/steps/eigentuemer/Bruchteilsgemeinschaft";
import BruchteilsgemeinschaftAngaben from "~/components/steps/eigentuemer/bruchteilsgemeinschaftangaben/BruchteilsgemeinschaftAngaben";
import Welcome from "~/components/steps/Welcome";
import GrundstueckUebersicht from "~/components/steps/grundstueck/GrundstueckUebersicht";
import GebaeudeUebersicht from "~/components/steps/gebaeude/GebaeudeUebersicht";
import { EmpfangsbevollmaechtigterNameHelp } from "~/components/steps/eigentuemer/empfangsbevollmaechtigter/EmpfangsbevollmaechtigterNameHelp";
import EigentuemerUebersicht from "~/components/steps/eigentuemer/EigentuemerUebersicht";
import EigentuemerAbschluss from "~/components/steps/eigentuemer/EigentuemerAbschluss";
import { BruchteilsgemeinschaftHelp } from "~/components/steps/eigentuemer/BruchteilsgemeinschaftHelp";

export { Default as FallbackStepComponent };

export default {
  welcome: Welcome,
  eigentuemer: {
    uebersicht: EigentuemerUebersicht,
    bruchteilsgemeinschaft: Bruchteilsgemeinschaft,
    bruchteilsgemeinschaftangaben: {
      angaben: BruchteilsgemeinschaftAngaben,
    },
    abschluss: EigentuemerAbschluss,
  },
  grundstueck: {
    uebersicht: GrundstueckUebersicht,
    bodenrichtwertInfo: BodenrichtwertInfo,
    bodenrichtwertEingabe: BodenrichtwertEingabe,
    bodenrichtwertAnzahl: BodenrichtwertAnzahl,

    flurstueck: {
      angaben: FlurstueckAngaben,
      flur: FlurstueckFlur,
      miteigentum: FlurstueckMiteigentum,
      miteigentumsanteil: FlurstueckMiteigentumsanteil,
      groesse: FlurstueckGroesse,
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
