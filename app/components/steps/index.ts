import Default from "~/components/steps/Default";
import BodenrichtwertInfo from "~/components/steps/grundstueck/BodenrichtwertInfo";
import FlurstueckFlur from "~/components/steps/grundstueck/flurstueck/FlurstueckFlur";
import FlurstueckGroesse from "~/components/steps/grundstueck/flurstueck/FlurstueckGroesse";
import Miteigentumsanteil from "~/components/steps/grundstueck/flurstueck/Miteigentumsanteil";
import Bruchteilsgemeinschaft from "~/components/steps/eigentuemer/Bruchteilsgemeinschaft";
import Willkommen from "~/components/steps/Willkommen";
import GrundstueckUebersicht from "~/components/steps/grundstueck/GrundstueckUebersicht";
import GrundstueckAnzahl from "~/components/steps/grundstueck/GrundstueckAnzahl";
import GebaeudeUebersicht from "~/components/steps/gebaeude/GebaeudeUebersicht";
import EigentuemerUebersicht from "~/components/steps/eigentuemer/EigentuemerUebersicht";
import EigentuemerAbschluss from "~/components/steps/eigentuemer/EigentuemerAbschluss";
import GrundstueckTyp from "~/components/steps/grundstueck/GrundstueckTyp";
import BodenrichtwertAnzahl from "~/components/steps/grundstueck/BodenrichtwertAnzahl";
import BodenrichtwertEingabe from "~/components/steps/grundstueck/BodenrichtwertEingabe";
import Wohnflaeche from "~/components/steps/gebaeude/Wohnflaeche";
import Wohnflaechen from "~/components/steps/gebaeude/Wohnflaechen";
import EigentuemerAnteil from "~/components/steps/eigentuemer/EigentuemerAnteil";
import EigentuemerAnzahl from "./eigentuemer/EigentuemerAnzahl";
import Kernsaniert from "~/components/steps/gebaeude/Kernsaniert.tsx";
import MiteigentumAuswahlHaus from "~/components/steps/grundstueck/miteigentum/MiteigentumAuswahlHaus";
import MiteigentumAuswahlWohnung from "~/components/steps/grundstueck/miteigentum/MiteigentumAuswahlWohnung";
import EmpfangsbevollmaechtigterName from "~/components/steps/eigentuemer/EmpfangsbevollmaechtigterName";

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
    empfangsbevollmaechtigter: {
      name: EmpfangsbevollmaechtigterName,
    },
  },
  grundstueck: {
    uebersicht: GrundstueckUebersicht,
    typ: GrundstueckTyp,
    miteigentumsanteil: Miteigentumsanteil,
    bodenrichtwertInfo: BodenrichtwertInfo,
    bodenrichtwertAnzahl: BodenrichtwertAnzahl,
    bodenrichtwertEingabe: BodenrichtwertEingabe,
    miteigentumAuswahlHaus: MiteigentumAuswahlHaus,
    miteigentumAuswahlWohnung: MiteigentumAuswahlWohnung,
    miteigentumWohnung: Miteigentumsanteil,
    miteigentumGarage: Miteigentumsanteil,
    anzahl: GrundstueckAnzahl,
    flurstueck: {
      flur: FlurstueckFlur,
      groesse: FlurstueckGroesse,
      miteigentum: Miteigentumsanteil,
    },
  },
  gebaeude: {
    uebersicht: GebaeudeUebersicht,
    kernsaniert: Kernsaniert,
    wohnflaeche: Wohnflaeche,
    wohnflaechen: Wohnflaechen,
  },
};
