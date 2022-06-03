import { Factory } from "fishery";
import {
  AuslandFields,
  BeguenstigungFields,
  BundeslandFields,
  EigentuemerTypFields,
  ElsterFields,
  ErbengemeinschaftFields,
  FremderBodenFields,
  GaragenFields,
  GrundstueckArtFields,
  PruefenModel,
} from "~/domain/pruefen/model";

class PruefenFactory extends Factory<PruefenModel> {
  eigentuemerTyp(fields?: Partial<EigentuemerTypFields>) {
    return this.params({
      eigentuemerTyp: {
        eigentuemerTyp: fields?.eigentuemerTyp,
      },
    });
  }

  erbengemeinschaft(fields?: Partial<ErbengemeinschaftFields>) {
    return this.params({
      erbengemeinschaft: {
        isErbengemeinschaft: fields?.isErbengemeinschaft,
      },
    });
  }

  bundesland(fields?: Partial<BundeslandFields>) {
    return this.params({
      bundesland: {
        bundesland: fields?.bundesland,
      },
    });
  }

  grundstueckArt(fields?: Partial<GrundstueckArtFields>) {
    return this.params({
      grundstueckArt: {
        grundstueckArt: fields?.grundstueckArt,
      },
    });
  }

  garagen(fields?: Partial<GaragenFields>) {
    return this.params({
      garagen: {
        garagen: fields?.garagen,
      },
    });
  }

  ausland(fields?: Partial<AuslandFields>) {
    return this.params({
      ausland: {
        ausland: fields?.ausland,
      },
    });
  }

  fremderBoden(fields?: Partial<FremderBodenFields>) {
    return this.params({
      fremderBoden: {
        fremderBoden: fields?.fremderBoden,
      },
    });
  }

  beguenstigung(fields?: Partial<BeguenstigungFields>) {
    return this.params({
      beguenstigung: {
        beguenstigung: fields?.beguenstigung,
      },
    });
  }

  elster(fields?: Partial<ElsterFields>) {
    return this.params({
      elster: {
        elster: fields?.elster,
      },
    });
  }

  full() {
    return this.params(
      this.eigentuemerTyp({ eigentuemerTyp: "privatperson" })
        .erbengemeinschaft({ isErbengemeinschaft: "noErbengemeinschaft" })
        .bundesland({ bundesland: "BB" })
        .grundstueckArt({ grundstueckArt: "zweifamilienhaus" })
        .garagen({ garagen: "garageAufGrundstueck" })
        .ausland({ ausland: "false" })
        .fremderBoden({ fremderBoden: "false" })
        .beguenstigung({ beguenstigung: "false" })
        .elster({ elster: "false" })
        .build()
    );
  }
}

export const pruefenModelFactory = PruefenFactory.define(() => ({}));
