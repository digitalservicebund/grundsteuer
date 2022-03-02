import { Factory } from "fishery";
import {
  GrundModel,
  EigentuemerAnzahlFields,
  EigentuemerPersonGesetzlicherVertreterFields,
  GrundstueckTypFields,
} from "~/domain/steps";
import { GebaeudeAb1949Fields } from "~/domain/steps/gebaeude/ab1949";

type PersonTransientParams = {
  transient: {
    personIndex: number;
  };
};

class GrundModelFactory extends Factory<GrundModel> {
  gebaeudeAb1949(fields?: GebaeudeAb1949Fields) {
    return this.params({
      gebaeude: {
        ab1949: {
          isAb1949: fields ? fields?.isAb1949 : "true",
        },
      },
    });
  }

  kernsaniert() {
    return this.params({
      gebaeude: {
        kernsaniert: {
          isKernsaniert: "true",
        },
      },
    });
  }

  withWeitereWohnraeume() {
    return this.params({
      gebaeude: {
        weitereWohnraeume: {
          hasWeitereWohnraeume: "true",
        },
      },
    });
  }

  withGaragen() {
    return this.params({
      gebaeude: {
        garagen: {
          hasGaragen: "true",
        },
      },
    });
  }

  eigentuemerAnzahl(fields?: EigentuemerAnzahlFields) {
    return this.params({
      eigentuemer: {
        anzahl: {
          anzahl: fields?.anzahl || "1",
        },
      },
    });
  }

  eigentuemerPersonGesetzlicherVertreter(
    fields?: EigentuemerPersonGesetzlicherVertreterFields,
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

  grundstueckTyp(fields?: GrundstueckTypFields) {
    return this.params({
      grundstueck: {
        typ: {
          typ: fields?.typ,
        },
      },
    });
  }
}

export const grundModelFactory = GrundModelFactory.define(() => ({}));
