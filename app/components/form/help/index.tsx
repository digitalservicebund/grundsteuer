import SteuernummerHelp from "~/components/form/help/grundstueck/Steuernummer";
import _ from "lodash";
import { GrundModel } from "~/domain/steps/index.server";
import { I18nObjectField } from "~/i18n/getStepI18n";
import DefaultHelpContent from "~/components/form/help/Default";
import GrundstueckAnzahlHelp from "~/components/form/help/grundstueck/GrundstueckAnzahl";
import GemarkungHelp from "~/components/form/help/grundstueck/Gemarkung";
import { getCurrentStateWithoutId } from "~/util/getCurrentState";
import GrundbuchblattHelp from "~/components/form/help/grundstueck/Grundbuchblatt";
import FlurHelp from "~/components/form/help/grundstueck/Flur";
import EigentuemerAnzahlHelp from "~/components/form/help/eigentuemer/EigentuemerAnzahl";
import { BodenrichtwertEingabeHelp } from "~/components/form/help/grundstueck/bodenrichtwert/BodenrichtwertEingabeHelp";
import {
  BodenrichtwertAnzahl1Help,
  BodenrichtwertAnzahl2Help,
} from "~/components/form/help/grundstueck/bodenrichtwert/BodenrichtwertAnzahlHelp";
import SteuerIdHelp from "~/components/form/help/eigentuemer/SteuerId";
import {
  MiteigentumAuswahlHausFalseHelp,
  MiteigentumAuswahlHausTrueHelp,
} from "~/components/form/help/grundstueck/miteigentum/MiteigentumAuswahlHaus";
import {
  MiteigentumAuswahlWohnungGarageHelp,
  MiteigentumAuswahlWohnungMixedHelp,
  MiteigentumAuswahlWohnungNoneHelp,
  MiteigentumAuswahlWohnungSondernutzungHelp,
} from "~/components/form/help/grundstueck/miteigentum/MiteigentumAuswahlWohnung";
import {
  MiteigentumAuswahlFlurstueckFalseHelp,
  MiteigentumAuswahlFlurstueckTrueHelp,
} from "~/components/form/help/grundstueck/miteigentum/MiteigentumAuswahlFlurstueck";
import WohnflaecheHelp from "~/components/form/help/gebaeude/Wohnflaeche";
import { EinfamilienhausHelp } from "~/components/form/help/grundstueck/haustyp/Einfamilienhaus";
import { ZweifamilienhausHelp } from "~/components/form/help/grundstueck/haustyp/Zweifamilienhaus";

export const helpComponents = {
  grundstueck: {
    haustyp: {
      haustyp: {
        einfamilienhaus: EinfamilienhausHelp,
        zweifamilienhaus: ZweifamilienhausHelp,
      },
    },
    steuernummer: { steuernummer: SteuernummerHelp },
    anzahl: { anzahl: GrundstueckAnzahlHelp },
    bodenrichtwertAnzahl: {
      anzahl: { 1: BodenrichtwertAnzahl1Help, 2: BodenrichtwertAnzahl2Help },
    },
    bodenrichtwertEingabe: { bodenrichtwert: BodenrichtwertEingabeHelp },
    miteigentumAuswahlHaus: {
      hasMiteigentum: {
        false: MiteigentumAuswahlHausFalseHelp,
        true: MiteigentumAuswahlHausTrueHelp,
      },
    },
    miteigentumAuswahlWohnung: {
      miteigentumTyp: {
        none: MiteigentumAuswahlWohnungNoneHelp,
        garage: MiteigentumAuswahlWohnungGarageHelp,
        sondernutzung: MiteigentumAuswahlWohnungSondernutzungHelp,
        mixed: MiteigentumAuswahlWohnungMixedHelp,
      },
    },
    flurstueck: {
      angaben: {
        gemarkung: GemarkungHelp,
        grundbuchblattnummer: GrundbuchblattHelp,
      },
      flur: {
        flur: FlurHelp,
      },
      miteigentumAuswahl: {
        hasMiteigentum: {
          true: MiteigentumAuswahlFlurstueckTrueHelp,
          false: MiteigentumAuswahlFlurstueckFalseHelp,
        },
      },
    },
  },
  gebaeude: {
    wohnflaeche: {
      wohnflaeche: WohnflaecheHelp,
    },
    wohnflaechen: {
      wohnflaeche1: WohnflaecheHelp,
      wohnflaeche2: WohnflaecheHelp,
    },
  },
  eigentuemer: {
    anzahl: {
      anzahl: EigentuemerAnzahlHelp,
    },
    person: {
      steuerId: {
        steuerId: SteuerIdHelp,
      },
    },
  },
};

export const getHelpComponent = ({
  path,
  allData,
  i18n,
  helpText,
}: {
  path: string;
  allData?: GrundModel;
  i18n?: I18nObjectField;
  helpText?: string;
}) => {
  const pathWithoutId = getCurrentStateWithoutId(path);
  const helpComponent = _.get(helpComponents, pathWithoutId);
  if (helpComponent) {
    return helpComponent({ allData, i18n });
  } else if (helpText) {
    return (
      <DefaultHelpContent elements={[{ type: "paragraph", value: helpText }]} />
    );
  }
};
