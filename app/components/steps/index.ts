import Default from "~/components/steps/Default";
import BodenrichtwertInfo from "~/components/steps/grundstueck/BodenrichtwertInfo";
import FlurstueckFlur from "~/components/steps/grundstueck/flurstueck/FlurstueckFlur";
import FlurstueckGroesse from "~/components/steps/grundstueck/flurstueck/FlurstueckGroesse";
import FlurstueckMiteigentumsanteil from "~/components/steps/grundstueck/flurstueck/FlurstueckMiteigentumsanteil";
import Bruchteilsgemeinschaft from "~/components/steps/eigentuemer/Bruchteilsgemeinschaft";
import Willkommen from "~/components/steps/Willkommen";
import GrundstueckUebersicht from "~/components/steps/grundstueck/GrundstueckUebersicht";
import GebaeudeUebersicht from "~/components/steps/gebaeude/GebaeudeUebersicht";
import EigentuemerUebersicht from "~/components/steps/eigentuemer/EigentuemerUebersicht";
import EigentuemerAbschluss from "~/components/steps/eigentuemer/EigentuemerAbschluss";
import GrundstueckTyp from "~/components/steps/grundstueck/GrundstueckTyp";
import BodenrichtwertAnzahl from "~/components/steps/grundstueck/BodenrichtwertAnzahl";
import BodenrichtwertEingabe from "~/components/steps/grundstueck/BodenrichtwertEingabe";

export { Default as FallbackStepComponent };

export default {
  welcome: Willkommen,
  eigentuemer: {
    uebersicht: EigentuemerUebersicht,
    bruchteilsgemeinschaft: Bruchteilsgemeinschaft,
    abschluss: EigentuemerAbschluss,
  },
  grundstueck: {
    uebersicht: GrundstueckUebersicht,
    typ: GrundstueckTyp,
    miteigentumsanteil: FlurstueckMiteigentumsanteil,
    bodenrichtwertInfo: BodenrichtwertInfo,
    bodenrichtwertAnzahl: BodenrichtwertAnzahl,
    bodenrichtwertEingabe: BodenrichtwertEingabe,
    flurstueck: {
      flur: FlurstueckFlur,
      groesse: FlurstueckGroesse,
    },
  },
  gebaeude: {
    uebersicht: GebaeudeUebersicht,
  },
};
