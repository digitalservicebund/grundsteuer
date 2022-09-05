import { Factory } from "fishery";
import {
  Flurstueck,
  GrundstueckFlurstueckAngabenFields,
  GrundstueckFlurstueckFlurFields,
  GrundstueckFlurstueckGroesseFields,
  GrundstueckFlurstueckMiteigentumAuswahlFields,
  GrundstueckFlurstueckMiteigentumFields,
} from "~/domain/steps/index.server";

class FlurstueckFactory extends Factory<Flurstueck> {
  angaben(fields?: Partial<GrundstueckFlurstueckAngabenFields>) {
    return this.params({
      angaben: {
        grundbuchblattnummer: "123",
        gemarkung: "Schöneberg",
        ...fields,
      },
    });
  }

  flur(fields?: Partial<GrundstueckFlurstueckFlurFields>) {
    return this.params({
      flur: {
        flur: "456",
        flurstueckZaehler: "2345",
        flurstueckNenner: "9876",
        ...fields,
      },
    });
  }

  groesse(fields?: Partial<GrundstueckFlurstueckGroesseFields>) {
    return this.params({
      groesse: {
        groesseHa: "1",
        groesseA: "2",
        groesseQm: "300",
        ...fields,
      },
    });
  }

  miteigentumAuswahl(
    fields?: Partial<GrundstueckFlurstueckMiteigentumAuswahlFields>
  ) {
    return this.params({
      miteigentumAuswahl: {
        hasMiteigentum: "false",
        ...fields,
      },
    });
  }

  miteigentum(fields?: Partial<GrundstueckFlurstueckMiteigentumFields>) {
    return this.params({
      miteigentum: {
        wirtschaftlicheEinheitZaehler: "1,2",
        wirtschaftlicheEinheitNenner: "500",
        ...fields,
      },
    });
  }
}

export const flurstueckFactory = FlurstueckFactory.define(() => ({}));
