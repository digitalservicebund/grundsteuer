import Default from "~/components/steps/Default";
import BodenrichtwertInfo from "~/components/steps/grundstueck/BodenrichtwertInfo";
import FlurstueckFlur from "~/components/steps/grundstueck/flurstueck/FlurstueckFlur";
import FlurstueckGroesse from "~/components/steps/grundstueck/flurstueck/FlurstueckGroesse";
import Bruchteilsgemeinschaft from "~/components/steps/eigentuemer/Bruchteilsgemeinschaft";
import Willkommen from "~/components/steps/Willkommen";
import GrundstueckUebersicht from "~/components/steps/grundstueck/GrundstueckUebersicht";
import GrundstueckAnzahl from "~/components/steps/grundstueck/GrundstueckAnzahl";
import GebaeudeUebersicht from "~/components/steps/gebaeude/GebaeudeUebersicht";
import EigentuemerUebersicht from "~/components/steps/eigentuemer/EigentuemerUebersicht";
import EigentuemerAbschluss from "~/components/steps/eigentuemer/EigentuemerAbschluss";
import Grundstuecktyp from "~/components/steps/grundstueck/Grundstuecktyp";
import BodenrichtwertAnzahl from "~/components/steps/grundstueck/BodenrichtwertAnzahl";
import BodenrichtwertEingabe from "~/components/steps/grundstueck/BodenrichtwertEingabe";
import Wohnflaeche from "~/components/steps/gebaeude/Wohnflaeche";
import Wohnflaechen from "~/components/steps/gebaeude/Wohnflaechen";
import EigentuemerAnteil from "~/components/steps/eigentuemer/EigentuemerAnteil";
import EigentuemerAnzahl from "./eigentuemer/EigentuemerAnzahl";
import Kernsaniert from "~/components/steps/gebaeude/Kernsaniert.tsx";
import MiteigentumAuswahlHaus from "~/components/steps/grundstueck/miteigentum/MiteigentumAuswahlHaus";
import MiteigentumAuswahlWohnung from "~/components/steps/grundstueck/miteigentum/MiteigentumAuswahlWohnung";
import MiteigentumsanteilGarage from "~/components/steps/grundstueck/MiteigentumsanteilGarage";
import FlurstueckMiteigentumsanteil from "~/components/steps/grundstueck/flurstueck/FlurstueckMiteigentumsanteil";
import MiteigentumsanteilWohnung from "~/components/steps/grundstueck/MiteigentumsanteilWohnung";
import FlurstueckAngaben from "~/components/steps/grundstueck/flurstueck/FlurstueckAngaben";
import Haustyp from "~/components/steps/grundstueck/Haustyp";
import GrundstueckBebaut from "~/components/steps/grundstueck/GrundstueckBebaut";

export { Default as FallbackStepComponent };

export default {
  welcome: Willkommen,
  eigentuemer: {
    uebersicht: EigentuemerUebersicht,
    anzahl: EigentuemerAnzahl,
    bruchteilsgemeinschaft: Bruchteilsgemeinschaft,
    abschluss: EigentuemerAbschluss,
    person: {
      anteil: EigentuemerAnteil,
    },
  },
  grundstueck: {
    uebersicht: GrundstueckUebersicht,
    bebaut: GrundstueckBebaut,
    grundstuecktyp: Grundstuecktyp,
    haustyp: Haustyp,
    bodenrichtwertInfo: BodenrichtwertInfo,
    bodenrichtwertAnzahl: BodenrichtwertAnzahl,
    bodenrichtwertEingabe: BodenrichtwertEingabe,
    miteigentumAuswahlHaus: MiteigentumAuswahlHaus,
    miteigentumAuswahlWohnung: MiteigentumAuswahlWohnung,
    miteigentumWohnung: MiteigentumsanteilWohnung,
    miteigentumGarage: MiteigentumsanteilGarage,
    anzahl: GrundstueckAnzahl,
    flurstueck: {
      angaben: FlurstueckAngaben,
      flur: FlurstueckFlur,
      groesse: FlurstueckGroesse,
      miteigentum: FlurstueckMiteigentumsanteil,
    },
  },
  gebaeude: {
    uebersicht: GebaeudeUebersicht,
    kernsaniert: Kernsaniert,
    wohnflaeche: Wohnflaeche,
    wohnflaechen: Wohnflaechen,
  },
};
