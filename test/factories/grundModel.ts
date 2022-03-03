import { Factory } from "fishery";
import _ from "lodash";
import {
  GrundModel,
  EigentuemerAnzahlFields,
  EigentuemerPersonGesetzlicherVertreterFields,
  GrundstueckTypFields,
  GrundstueckAnzahlFields,
  GrundstueckAdresseFields,
  GrundstueckSteuernummerFields,
  GrundstueckGemeindeFields,
  // GrundstueckFlurstueckAngabenFields,
  GrundstueckBodenrichtwertFields,
  GrundstueckUnbebautFields,
} from "~/domain/steps";
import { GebaeudeAb1949Fields } from "~/domain/steps/gebaeude/ab1949";
import { GebaeudeKernsaniertFields } from "~/domain/steps/gebaeude/kernsaniert";
import { GebaeudeWeitereWohnraeumeFields } from "~/domain/steps/gebaeude/weitereWohnraeume";
import { GebaeudeGaragenFields } from "~/domain/steps/gebaeude/garagen";

type PersonTransientParams = {
  transient: {
    personIndex: number;
  };
};

// type FlurstueckTransientParams = {
//   transient: {
//     flurstueckIndex: number;
//   };
// };

const strasse = _.sample([
  "Hauptstraße",
  "Tal",
  "P4",
  "Straße 254",
  "Bischöflich-Geistlicher-Rat-Josef-Zinnbauer-Straße",
  "Laehr'scher Jagdweg",
  "Rue d'Achères",
]);
const hausnummer = _.sample(["1", "42", "9999"]);
const plz = _.sample(["01001", "90329"]);
const ort = _.sample([
  "Hausen",
  "Au",
  "Hellschen-Heringsand-Unterschaar",
  "Petershagen/Eggersdorf",
  "St. Leon-Rot",
]);

class GrundModelFactory extends Factory<GrundModel> {
  grundstueckAdresse(fields?: Partial<GrundstueckAdresseFields>) {
    return this.params({
      grundstueck: {
        adresse: {
          strasse,
          hausnummer,
          zusatzangaben: "something",
          plz,
          ort,
          ...fields,
        },
      },
    });
  }

  grundstueckSteuernummer(fields?: Partial<GrundstueckSteuernummerFields>) {
    return this.params({
      grundstueck: {
        steuernummer: {
          steuernummer: "1234567890",
          ...fields,
        },
      },
    });
  }

  grundstueckTyp(fields?: Partial<GrundstueckTypFields>) {
    return this.params({
      grundstueck: {
        typ: {
          typ: "einfamilienhaus",
          ...fields,
        },
      },
    });
  }

  grundstueckUnbebaut(fields?: Partial<GrundstueckUnbebautFields>) {
    return this.params({
      grundstueck: {
        unbebaut: {
          zustand: "bauerwartungsland",
          ...fields,
        },
      },
    });
  }

  grundstueckGemeinde(fields?: Partial<GrundstueckGemeindeFields>) {
    return this.params({
      grundstueck: {
        gemeinde: {
          innerhalbEinerGemeinde: "true",
          ...fields,
        },
      },
    });
  }

  grundstueckAnzahl(fields?: Partial<GrundstueckAnzahlFields>) {
    return this.params({
      grundstueck: {
        anzahl: {
          anzahl: "2",
          ...fields,
        },
      },
    });
  }

  // grundstueckFlurstueckAngaben(
  //   fields?: Partial<GrundstueckFlurstueckAngabenFields>,
  //   params?: FlurstueckTransientParams
  // ) {
  //   return this.params({
  //     grundstueck: {
  //       flurstueck: {
  //         [params?.transient.flurstueckIndex || 0]: {
  //           angaben: {
  //             grundbuchblattnummer: "123",
  //             // TODO missing fields
  //             ...fields,
  //           },
  //         },
  //       },
  //     },
  //   });
  // }

  grundstueckBodenrichtwert(fields?: Partial<GrundstueckBodenrichtwertFields>) {
    return this.params({
      grundstueck: {
        bodenrichtwert: {
          bodenrichtwert: "200",
          ...fields,
        },
      },
    });
  }

  gebaeudeAb1949(fields?: Partial<GebaeudeAb1949Fields>) {
    return this.params({
      gebaeude: {
        ab1949: {
          isAb1949: fields ? fields?.isAb1949 : "true",
        },
      },
    });
  }

  kernsaniert(fields?: Partial<GebaeudeKernsaniertFields>) {
    return this.params({
      gebaeude: {
        kernsaniert: {
          isKernsaniert: fields ? fields?.isKernsaniert : "true",
        },
      },
    });
  }

  withWeitereWohnraeume(fields?: Partial<GebaeudeWeitereWohnraeumeFields>) {
    return this.params({
      gebaeude: {
        weitereWohnraeume: {
          hasWeitereWohnraeume: fields ? fields?.hasWeitereWohnraeume : "true",
        },
      },
    });
  }

  withGaragen(fields?: Partial<GebaeudeGaragenFields>) {
    return this.params({
      gebaeude: {
        garagen: {
          hasGaragen: fields ? fields?.hasGaragen : "true",
        },
      },
    });
  }

  eigentuemerAnzahl(fields?: Partial<EigentuemerAnzahlFields>) {
    return this.params({
      eigentuemer: {
        anzahl: {
          anzahl: fields?.anzahl || "1",
        },
      },
    });
  }

  eigentuemerPersonGesetzlicherVertreter(
    fields?: Partial<EigentuemerPersonGesetzlicherVertreterFields>,
    params?: PersonTransientParams
  ) {
    return this.params({
      eigentuemer: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        person: {
          [params?.transient.personIndex || 0]: {
            gesetzlicherVertreter: {
              hasVertreter: fields?.hasVertreter || "false",
            },
          },
        },
      },
    });
  }

  // TODO refactor, use grundstueckAnzahl
  flurstueckAnzahl(fields?: Partial<GrundstueckAnzahlFields>) {
    return this.params({
      grundstueck: {
        anzahl: {
          anzahl: fields?.anzahl || "1",
        },
      },
    });
  }
}

export const grundModelFactory = GrundModelFactory.define(() => ({}));
