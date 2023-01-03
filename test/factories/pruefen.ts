import { Factory } from "fishery";
import {
  AbgeberFields,
  AuslandFields,
  BeguenstigungFields,
  BewohnbarFields,
  BundeslandFields,
  EigentuemerTypFields,
  FremderBodenFields,
  GebaeudeArtBewohnbarFields,
  GrundstueckArtFields,
} from "~/domain/pruefen/model";
import { PruefenMachineContext } from "~/domain/pruefen/states.server";
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

  bewohnbar(fields?: Partial<BewohnbarFields>) {
    return this.params({
      bewohnbar: {
        bewohnbar: fields?.bewohnbar,
      },
    });
  }

  gebaeudeArtBewohnbar(fields?: Partial<GebaeudeArtBewohnbarFields>) {
    return this.params({
      gebaeudeArtBewohnbar: {
        gebaeude: fields?.gebaeude,
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

  full() {
    return this.params(
      this.abgeber({ abgeber: "eigentuemer" })
        .eigentuemerTyp({ eigentuemerTyp: "privatperson" })
        .bundesland({ bundesland: "BB" })
        .grundstueckArt({ grundstueckArt: "zweifamilienhaus" })
        .ausland({ ausland: "false" })
        .fremderBoden({ fremderBoden: "false" })
        .beguenstigung({ beguenstigung: "false" })
        .build()
    );
  }
}

export const pruefenModelFactory = PruefenFactory.define(() => ({
  testFeaturesEnabled: testFeaturesEnabled(),
}));
