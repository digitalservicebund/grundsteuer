import { Factory } from "fishery";
import {
  GrundModel,
  EigentuemerAnzahlFields,
  EigentuemerPersonGesetzlicherVertreterFields,
  GrundstueckFields,
} from "~/domain/steps";

type PersonTransientParams = {
  transient: {
    personIndex: number;
  };
};

class GrundModelFactory extends Factory<GrundModel> {
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
  grundstueck(fields?: GrundstueckFields) {
    return this.params({
      grundstueck: {
        bebaut: fields?.bebaut || "false",
      },
    });
  }
}

export const grundModelFactory = GrundModelFactory.define(() => ({}));
