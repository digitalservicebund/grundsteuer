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
  GebaeudeArtUnbebautFields,
  GebaeudeArtUnbewohnbarFields,
  GrundstueckArtFields,
  NutzungsartFields,
} from "~/domain/pruefen/model";
import { PruefenMachineContext } from "~/domain/pruefen/states.server";
import { testFeaturesEnabled } from "~/util/testFeaturesEnabled";

class PruefenFactory extends Factory<PruefenMachineContext> {
  abgeber(fields?: Partial<AbgeberFields>) {
    return this.params({
      start: {
        abgeber: fields?.abgeber,
      },
      abgeber: {
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

  gebaeudeArtUnbewohnbar(fields?: Partial<GebaeudeArtUnbewohnbarFields>) {
    return this.params({
      gebaeudeArtUnbewohnbar: {
        gebaeude: fields?.gebaeude,
      },
    });
  }

  gebaeudeArtUnbebaut(fields?: Partial<GebaeudeArtUnbebautFields>) {
    return this.params({
      gebaeudeArtUnbebaut: {
        art: fields?.art,
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

  nutzungsart(fields?: Partial<NutzungsartFields>) {
    return this.params({
      nutzungsart: {
        wirtschaftlich: fields?.wirtschaftlich,
      },
    });
  }

  full() {
    return this.params(
      this.abgeber({ abgeber: "eigentuemer" })
        .eigentuemerTyp({ eigentuemerTyp: "privatperson" })
        .bundesland({ bundesland: "BB" })
        .bewohnbar({ bewohnbar: "unbebaut" })
        .gebaeudeArtUnbebaut({ art: "baureif" })
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
