import { Factory } from "fishery";
import {
  AbgeberFields,
  AuslandFields,
  BeguenstigungFields,
  BundeslandFields,
  EigentuemerTypFields,
  ElsterFields,
  FremderBodenFields,
  GaragenFields,
  GrundstueckArtFields,
} from "~/domain/pruefen/model";
import { PruefenMachineContext } from "~/domain/pruefen/states";
import { testFeaturesEnabled } from "~/util/testFeaturesEnabled";

class PruefenFactory extends Factory<PruefenMachineContext> {
  abgeber(fields?: Partial<AbgeberFields>) {
    return this.params({
      start: {
        abgeber: fields?.abgeber,
      },
    });
  }

  eigentuemerTyp(fields?: Partial<EigentuemerTypFields>) {
    return this.params({
      eigentuemerTyp: {
        eigentuemerTyp: fields?.eigentuemerTyp,
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

  garagen(fields?: Partial<GaragenFields>) {
    return this.params({
      garagen: {
        garagen: fields?.garagen,
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
      this.abgeber({ abgeber: "eigentuemer" })
        .eigentuemerTyp({ eigentuemerTyp: "privatperson" })
        .bundesland({ bundesland: "BB" })
        .grundstueckArt({ grundstueckArt: "zweifamilienhaus" })
        .ausland({ ausland: "false" })
        .fremderBoden({ fremderBoden: "false" })
        .beguenstigung({ beguenstigung: "false" })
        .garagen({ garagen: "wohnung" })
        .elster({ elster: "false" })
        .build()
    );
  }
}

export const pruefenModelFactory = PruefenFactory.define(() => ({
  testFeaturesEnabled: testFeaturesEnabled(),
}));
