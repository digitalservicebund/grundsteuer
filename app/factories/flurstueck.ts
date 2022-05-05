import { Factory } from "fishery";
import {
  Flurstueck,
  GrundstueckFlurstueckAngabenFields,
  GrundstueckFlurstueckFlurFields,
  GrundstueckFlurstueckGroesseFields,
} from "~/domain/steps";

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
        wirtschaftlicheEinheitZaehler: "1",
        wirtschaftlicheEinheitNenner: "234",
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
}

export const flurstueckFactory = FlurstueckFactory.define(() => ({}));
