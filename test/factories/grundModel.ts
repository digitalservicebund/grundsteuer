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
  GrundstueckBodenrichtwertFields,
  GrundstueckAbweichendeEntwicklungFields,
  Flurstueck,
} from "~/domain/steps";
import { GebaeudeAb1949Fields } from "~/domain/steps/gebaeude/ab1949";
import { GebaeudeKernsaniertFields } from "~/domain/steps/gebaeude/kernsaniert";
import { GebaeudeWeitereWohnraeumeFields } from "~/domain/steps/gebaeude/weitereWohnraeume";
import { GebaeudeGaragenFields } from "~/domain/steps/gebaeude/garagen";
import { EigentuemerVerheiratetFields } from "~/domain/steps/eigentuemer/verheiratet";
import { EigentuemerEmpfangsvollmachtFields } from "~/domain/steps/eigentuemer/empfangsvollmacht";
import { flurstueckFactory } from "./flurstueck";
import { EigentuemerPersonAdresseFields } from "~/domain/steps/eigentuemer/person/adresse";
import { EigentuemerBruchteilsgemeinschaftFields } from "~/domain/steps/eigentuemer/bruchteilsgemeinschaft";
import { GebaeudeBaujahrFields } from "~/domain/steps/gebaeude/baujahr";

type PersonTransientParams = {
  transient: {
    personIndex: number;
  };
};

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
          typ: fields ? fields.typ : "einfamilienhaus",
          ...fields,
        },
      },
    });
  }

  grundstueckAbweichendeEntwicklung(
    fields?: Partial<GrundstueckAbweichendeEntwicklungFields>
  ) {
    return this.params({
      grundstueck: {
        abweichendeEntwicklung: {
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

  grundstueckFlurstueck({
    list,
    count,
  }: {
    list?: Flurstueck[];
    count?: number;
  }) {
    const flurstueckList =
      list ||
      flurstueckFactory
        .angaben()
        .flur()
        .groesse()
        .buildList(count || 1);

    return this.params({
      grundstueck: {
        flurstueck: flurstueckList,
      },
    });
  }

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

  gebaeudeBaujahr(fields?: Partial<GebaeudeBaujahrFields>) {
    return this.params({
      gebaeude: {
        baujahr: {
          baujahr: fields?.baujahr,
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

  hasAbbruchverpflichtung(flag?: "true" | "false") {
    return this.params({
      gebaeude: {
        abbruchverpflichtung: {
          hasAbbruchverpflichtung: flag ? flag : "true",
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

  eigentuemerVerheiratet(fields?: Partial<EigentuemerVerheiratetFields>) {
    return this.params({
      eigentuemer: {
        verheiratet: {
          areVerheiratet: fields?.areVerheiratet,
        },
      },
    });
  }

  eigentuemerPersonAdresse(
    fields?: Partial<EigentuemerPersonAdresseFields>,
    params?: PersonTransientParams
  ) {
    return this.params({
      eigentuemer: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        person: {
          [params?.transient.personIndex || 0]: {
            adresse: fields,
          },
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

  eigentuemerBruchteilsgemeinschaft(
    fields?: Partial<EigentuemerBruchteilsgemeinschaftFields>
  ) {
    return this.params({
      eigentuemer: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        bruchteilsgemeinschaft: {
          predefinedData: fields?.predefinedData,
        },
      },
    });
  }

  eigentuemerEmpfangsvollmacht(
    fields?: Partial<EigentuemerEmpfangsvollmachtFields>
  ) {
    return this.params({
      eigentuemer: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        empfangsvollmacht: {
          hasEmpfangsvollmacht: fields?.hasEmpfangsvollmacht || "false",
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
