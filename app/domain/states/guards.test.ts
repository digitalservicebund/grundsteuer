import {
  conditions,
  previousFlurstueckHasMiteigentum,
} from "~/domain/states/guards";
import { StateMachineContext } from "~/domain/states/states.server";
import { flurstueckFactory, grundModelFactory } from "test/factories";
import { GrundModel } from "../steps/index.server";

describe("isEigentumswohnung", () => {
  it("Should return false if data is undefined", async () => {
    const result = conditions.isEigentumswohnung(undefined);
    expect(result).toEqual(false);
  });

  it("Should return false if typ is invalid", async () => {
    const inputData = grundModelFactory
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .haustyp({ haustyp: "INVALID" })
      .build();
    const result = conditions.isEigentumswohnung(inputData);
    expect(result).toEqual(false);
  });

  it("Should return false if typ is not wohnungseigentum", async () => {
    const wrongValues = ["einfamilienhaus", "zweifamilienhaus"];
    wrongValues.forEach((wrongValue) => {
      const inputData = grundModelFactory
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .grundstuecktyp({ typ: wrongValue })
        .build();
      const result = conditions.isEigentumswohnung(inputData);
      expect(result).toEqual(false);
    });
  });

  it("Should return true if typ is wohnungseigentum", async () => {
    const inputData = grundModelFactory
      .bebaut({ bebaut: "bebaut" })
      .haustyp({ haustyp: "wohnungseigentum" })
      .build();
    const result = conditions.isEigentumswohnung({
      ...inputData,
    });
    expect(result).toEqual(true);
  });

  it("Should return false if typ is wohnungseigentum but not bebaut", async () => {
    const inputData = grundModelFactory
      .bebaut({ bebaut: "unbebaut" })
      .haustyp({ haustyp: "wohnungseigentum" })
      .build();
    const result = conditions.isEigentumswohnung({
      ...inputData,
    });
    expect(result).toEqual(false);
  });
});

describe("isZweifamilienhaus", () => {
  it("Should return false if data is undefined", async () => {
    const result = conditions.isZweifamilienhaus(undefined);
    expect(result).toEqual(false);
  });

  it("Should return false if typ is invalid", async () => {
    const inputData = grundModelFactory
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .grundstuecktyp({ typ: "INVALID" })
      .build();
    const result = conditions.isZweifamilienhaus(inputData);
    expect(result).toEqual(false);
  });

  it("Should return false if typ is not zweifamilienhaus", async () => {
    const wrongValues = [
      "einfamilienhaus",
      "wohnungseigentum",
      "baureif",
      "unbebaut",
    ];
    wrongValues.forEach((wrongValue) => {
      const inputData = grundModelFactory
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .grundstuecktyp({ typ: wrongValue })
        .build();
      const result = conditions.isZweifamilienhaus(inputData);
      expect(result).toEqual(false);
    });
  });

  it("Should return true if typ is zweifamilienhaus", async () => {
    const inputData = grundModelFactory
      .bebaut({ bebaut: "bebaut" })
      .haustyp({ haustyp: "zweifamilienhaus" })
      .build();
    const result = conditions.isZweifamilienhaus(inputData);
    expect(result).toEqual(true);
  });

  it("Should return false if typ is zweifamilienhaus but not bebaut", async () => {
    const inputData = grundModelFactory
      .bebaut({ bebaut: "unbebaut" })
      .haustyp({ haustyp: "zweifamilienhaus" })
      .build();
    const result = conditions.isZweifamilienhaus(inputData);
    expect(result).toEqual(false);
  });
});

describe("previousFlurstueckHasMiteigentum", () => {
  it("returns false if first flurstueck", () => {
    expect(previousFlurstueckHasMiteigentum({ flurstueckId: 1 })).toBe(false);
  });

  it("returns false if unbebaut", () => {
    expect(
      previousFlurstueckHasMiteigentum({
        grundstueck: {
          bebaut: { bebaut: "baureif" },
          grundstuecktyp: { grundstuecktyp: "baureif" },
        },
        flurstueckId: 1,
      })
    ).toBe(false);
  });

  it("returns true if second flurstueck and both flurstueck have miteigentum", () => {
    const inputData = grundModelFactory
      .bebaut({ bebaut: "bebaut" })
      .haustyp({ haustyp: "wohnungseigentum" })
      .miteigentumWohnung({ miteigentumTyp: "mixed" })
      .grundstueckFlurstueck({
        list: [
          flurstueckFactory
            .miteigentumAuswahl({ hasMiteigentum: "true" })
            .build(),
          flurstueckFactory
            .miteigentumAuswahl({ hasMiteigentum: "true" })
            .build(),
        ],
        count: 2,
      })
      .build();
    expect(
      previousFlurstueckHasMiteigentum({ flurstueckId: 2, ...inputData })
    ).toBe(true);
  });

  it("returns true if second flurstueck and first flurstueck has miteigentum", () => {
    const inputData = grundModelFactory
      .bebaut({ bebaut: "bebaut" })
      .haustyp({ haustyp: "einfamilienhaus" })
      .miteigentumHaus({ hasMiteigentum: "true" })
      .grundstueckFlurstueck({
        list: [
          flurstueckFactory
            .miteigentumAuswahl({ hasMiteigentum: "true" })
            .build(),
          flurstueckFactory
            .miteigentumAuswahl({ hasMiteigentum: "false" })
            .build(),
        ],
        count: 2,
      })
      .build();
    expect(
      previousFlurstueckHasMiteigentum({ flurstueckId: 2, ...inputData })
    ).toBe(true);
  });

  it("returns false if previous flurstueck empty", () => {
    const inputData = grundModelFactory
      .bebaut({ bebaut: "bebaut" })
      .haustyp({ haustyp: "einfamilienhaus" })
      .miteigentumHaus({ hasMiteigentum: "true" })
      .grundstueckFlurstueck({
        list: [],
        count: 2,
      })
      .build();
    expect(
      previousFlurstueckHasMiteigentum({ flurstueckId: 2, ...inputData })
    ).toBe(false);
  });
});

describe("isBezugsfertigAb1949", () => {
  it("Should return false if data is undefined", async () => {
    const result = conditions.isBezugsfertigAb1949(undefined);
    expect(result).toEqual(false);
  });

  it("Should return false if unbebaut", async () => {
    const unbebautValues = ["baureif", "unbebaut"];
    unbebautValues.forEach((unbebautValue) => {
      const inputData = grundModelFactory
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .grundstuecktyp({ typ: unbebautValue })
        .build();
      const result = conditions.isBezugsfertigAb1949(inputData);
      expect(result).toEqual(false);
    });
  });

  describe("Bebaut", () => {
    it("Should return true if isAb1949 is true", async () => {
      const bebautValues = [
        "einfamilienhaus",
        "zweifamilienhaus",
        "wohnungseigentum",
      ];
      bebautValues.forEach((bebautValue) => {
        const inputData = grundModelFactory
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .bebaut({ bebaut: "bebaut" })
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .haustyp({ haustyp: bebautValue })
          .gebaeudeAb1949({ isAb1949: "true" })
          .build();
        const result = conditions.isBezugsfertigAb1949(inputData);
        expect(result).toEqual(true);
      });
    });

    it("Should return false if isAb1949 is false", async () => {
      const bebautValues = [
        "einfamilienhaus",
        "zweifamilienhaus",
        "wohnungseigentum",
      ];
      bebautValues.forEach((bebautValue) => {
        const inputData = grundModelFactory
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .bebaut({ bebaut: "bebaut" })
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .haustyp({ haustyp: bebautValue })
          .gebaeudeAb1949({ isAb1949: "false" })
          .build();
        const result = conditions.isBezugsfertigAb1949(inputData);
        expect(result).toEqual(false);
      });
    });
  });
});

describe("isKernsaniert", () => {
  it("Should return false if data is undefined", async () => {
    const result = conditions.isKernsaniert(undefined);
    expect(result).toEqual(false);
  });

  it("Should return false if unbebaut", async () => {
    const unbebautValues = ["baureif", "unbebaut"];
    unbebautValues.forEach((unbebautValue) => {
      const inputData = grundModelFactory
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .grundstuecktyp({ typ: unbebautValue })
        .build();
      const result = conditions.isKernsaniert(inputData);
      expect(result).toEqual(false);
    });
  });

  describe("Bebaut", () => {
    it("Should return true if isKernsaniert is true", async () => {
      const bebautValues = [
        "einfamilienhaus",
        "zweifamilienhaus",
        "wohnungseigentum",
      ];
      bebautValues.forEach((bebautValue) => {
        const inputData = grundModelFactory
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .bebaut({ bebaut: "bebaut" })
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .haustyp({ haustyp: bebautValue })
          .kernsaniert({ isKernsaniert: "true" })
          .build();
        const result = conditions.isKernsaniert(inputData);
        expect(result).toEqual(true);
      });
    });

    it("Should return false if isKernsaniert is false", async () => {
      const bebautValues = [
        "einfamilienhaus",
        "zweifamilienhaus",
        "wohnungseigentum",
      ];
      bebautValues.forEach((bebautValue) => {
        const inputData = grundModelFactory
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .grundstuecktyp({ typ: bebautValue })
          .kernsaniert({ isKernsaniert: "false" })
          .build();
        const result = conditions.isKernsaniert(inputData);
        expect(result).toEqual(false);
      });
    });
  });
});

describe("hasAbbruchverpflichtung", () => {
  it("Should return false if data is undefined", async () => {
    const result = conditions.hasAbbruchverpflichtung(undefined);
    expect(result).toEqual(false);
  });

  it("Should return false if unbebaut", async () => {
    const unbebautValues = ["baureif", "unbebaut"];
    unbebautValues.forEach((unbebautValue) => {
      const inputData = grundModelFactory
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .grundstuecktyp({ typ: unbebautValue })
        .build();
      const result = conditions.hasAbbruchverpflichtung(inputData);
      expect(result).toEqual(false);
    });
  });

  describe("Bebaut", () => {
    it("Should return true if hasAbbruchverpflichtung is true", async () => {
      const bebautValues = [
        "einfamilienhaus",
        "zweifamilienhaus",
        "wohnungseigentum",
      ];
      bebautValues.forEach((bebautValue) => {
        const inputData = grundModelFactory
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .bebaut({ bebaut: "bebaut" })
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .haustyp({ haustyp: bebautValue })
          .abbruchverpflichtung()
          .build();
        const result = conditions.hasAbbruchverpflichtung(inputData);
        expect(result).toEqual(true);
      });
    });

    it("Should return false if abbruchverpflichtung is false", async () => {
      const bebautValues = [
        "einfamilienhaus",
        "zweifamilienhaus",
        "wohnungseigentum",
      ];
      bebautValues.forEach((bebautValue) => {
        const inputData = grundModelFactory
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .grundstuecktyp({ typ: bebautValue })
          .abbruchverpflichtung({ hasAbbruchverpflichtung: "false" })
          .build();
        const result = conditions.hasAbbruchverpflichtung(inputData);
        expect(result).toEqual(false);
      });
    });
  });
});

describe("hasWeitereWohnraeume", () => {
  it("Should return false if data is undefined", async () => {
    const result = conditions.hasWeitereWohnraeume(undefined);
    expect(result).toEqual(false);
  });

  it("Should return false if unbebaut", async () => {
    const unbebautValues = ["baureif", "unbebaut"];
    unbebautValues.forEach((unbebautValue) => {
      const inputData = grundModelFactory
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .grundstuecktyp({ typ: unbebautValue })
        .build();
      const result = conditions.hasWeitereWohnraeume(inputData);
      expect(result).toEqual(false);
    });
  });

  describe("Bebaut", () => {
    it("Should return true if hasWeitereWohnraeume is true", async () => {
      const bebautValues = [
        "einfamilienhaus",
        "zweifamilienhaus",
        "wohnungseigentum",
      ];
      bebautValues.forEach((bebautValue) => {
        const inputData = grundModelFactory
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .bebaut({ bebaut: "bebaut" })
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .haustyp({ haustyp: bebautValue })
          .withWeitereWohnraeume({ hasWeitereWohnraeume: "true" })
          .build();
        const result = conditions.hasWeitereWohnraeume(inputData);
        expect(result).toEqual(true);
      });
    });

    it("Should return false if hasWeitereWohnraeume is false", async () => {
      const bebautValues = [
        "einfamilienhaus",
        "zweifamilienhaus",
        "wohnungseigentum",
      ];
      bebautValues.forEach((bebautValue) => {
        const inputData = grundModelFactory
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .grundstuecktyp({ typ: bebautValue })
          .withWeitereWohnraeume({ hasWeitereWohnraeume: "false" })
          .build();
        const result = conditions.hasWeitereWohnraeume(inputData);
        expect(result).toEqual(false);
      });
    });
  });
});

describe("hasGaragen", () => {
  it("Should return false if data is undefined", async () => {
    const result = conditions.hasGaragen(undefined);
    expect(result).toEqual(false);
  });

  it("Should return false if unbebaut", async () => {
    const unbebautValues = ["baureif", "unbebaut"];
    unbebautValues.forEach((unbebautValue) => {
      const inputData = grundModelFactory
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .grundstuecktyp({ typ: unbebautValue })
        .build();
      const result = conditions.hasGaragen(inputData);
      expect(result).toEqual(false);
    });
  });

  describe("Bebaut", () => {
    it("Should return true if hasGaragen is true", async () => {
      const bebautValues = [
        "einfamilienhaus",
        "zweifamilienhaus",
        "wohnungseigentum",
      ];
      bebautValues.forEach((bebautValue) => {
        const inputData = grundModelFactory
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .bebaut({ bebaut: "bebaut" })
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .haustyp({ haustyp: bebautValue })
          .withGaragen({ hasGaragen: "true" })
          .build();
        const result = conditions.hasGaragen(inputData);
        expect(result).toEqual(true);
      });
    });

    it("Should return false if hasGaragen is false", async () => {
      const bebautValues = [
        "einfamilienhaus",
        "zweifamilienhaus",
        "wohnungseigentum",
      ];
      bebautValues.forEach((bebautValue) => {
        const inputData = grundModelFactory
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .grundstuecktyp({ typ: bebautValue })
          .withGaragen({ hasGaragen: "false" })
          .build();
        const result = conditions.hasGaragen(inputData);
        expect(result).toEqual(false);
      });
    });
  });
});

describe("isBruchteilsgemeinschaft", () => {
  it("Should return false if data is undefined", async () => {
    const result = conditions.isBruchteilsgemeinschaft(undefined);
    expect(result).toEqual(false);
  });

  const cases = [
    { anzahl: "1", areVerheiratet: undefined, expectedValue: false },
    { anzahl: 1, areVerheiratet: undefined, expectedValue: false },
    { anzahl: "1", areVerheiratet: "true", expectedValue: false },
    { anzahl: "2", areVerheiratet: undefined, expectedValue: false },
    { anzahl: "2", areVerheiratet: "true", expectedValue: false },
    { anzahl: "2", areVerheiratet: "false", expectedValue: true },
    { anzahl: "3", areVerheiratet: undefined, expectedValue: true },
  ];

  test.each(cases)(
    "Should return $expectedValue if anzahl is $anzahl and verheiratet is $areVerheiratet",
    ({ anzahl, areVerheiratet, expectedValue }) => {
      const inputData = grundModelFactory
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .eigentuemerAnzahl({ anzahl })
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .eigentuemerVerheiratet({ areVerheiratet })
        .build();
      const result = conditions.isBruchteilsgemeinschaft(inputData);
      expect(result).toEqual(expectedValue);
    }
  );
});

describe("customBruchteilsgemeinschaftData", () => {
  it("Should return false if data is undefined", async () => {
    const result = conditions.customBruchteilsgemeinschaftData(undefined);
    expect(result).toEqual(false);
  });

  const cases = [
    { predefinedData: "true", expectedValue: false },
    { predefinedData: undefined, expectedValue: false },
    { predefinedData: "false", expectedValue: true },
  ];

  test.each(cases)(
    "Should return $expectedValue if predefinedData is $predefinedData",
    ({ predefinedData, expectedValue }) => {
      const inputData = grundModelFactory
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .eigentuemerBruchteilsgemeinschaft({ predefinedData })
        .build();
      const result = conditions.customBruchteilsgemeinschaftData(inputData);
      expect(result).toEqual(expectedValue);
    }
  );
});

describe("anzahlEigentuemerIsTwo", () => {
  it("Should return false if data is undefined", async () => {
    const result = conditions.anzahlEigentuemerIsTwo(undefined);
    expect(result).toEqual(false);
  });

  it("Should return false if anzahl eigentümer is not 2", async () => {
    const wrongValues = ["1", undefined, "hi", 3];
    wrongValues.forEach((wrongValue) => {
      const inputData = grundModelFactory
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .eigentuemerAnzahl({ anzahl: wrongValue })
        .build();
      const result = conditions.anzahlEigentuemerIsTwo(inputData);
      expect(result).toEqual(false);
    });
  });

  it("Should return true if anzahl eigentümer is 2", async () => {
    const inputData = grundModelFactory
      .eigentuemerAnzahl({ anzahl: "2" })
      .build();
    const result = conditions.anzahlEigentuemerIsTwo(inputData);
    expect(result).toEqual(true);
  });
});

describe("hasMultipleEigentuemer", () => {
  it("Should return false if data is undefined", async () => {
    const result = conditions.hasMultipleEigentuemer(undefined);
    expect(result).toEqual(false);
  });

  it("Should return false if anzahl eigentümer is 1 or 0", async () => {
    const wrongValues = ["1", "0"];
    wrongValues.forEach((wrongValue) => {
      const inputData = grundModelFactory
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .eigentuemerAnzahl({ anzahl: wrongValue })
        .build();
      const result = conditions.hasMultipleEigentuemer(inputData);
      expect(result).toEqual(false);
    });
  });

  it("Should return true if anzahl eigentümer is 2 or more", async () => {
    const correctValues = ["2", "3", "5"];
    correctValues.forEach((correctValue) => {
      const inputData = grundModelFactory
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .eigentuemerAnzahl({ anzahl: correctValue })
        .build();
      const result = conditions.hasMultipleEigentuemer(inputData);
      expect(result).toEqual(true);
    });
  });
});

describe("hasGesetzlicherVertreter", () => {
  describe("eigentuemer id not set", () => {
    // TODO I think this should actually throw an error instead of just taking 1 as default?
    it("Should return false if data undefined", async () => {
      const result = conditions.hasGesetzlicherVertreter(undefined);
      expect(result).toEqual(false);
    });
  });

  describe("first eigentuemer", () => {
    it("Should return false if data is undefined", async () => {
      const result = conditions.hasGesetzlicherVertreter(undefined);
      expect(result).toEqual(false);
    });

    it("Should return false if hasVertreter is false", async () => {
      const inputData = grundModelFactory
        .eigentuemerPersonGesetzlicherVertreter({ hasVertreter: "false" })
        .build();
      const result = conditions.hasGesetzlicherVertreter(inputData);
      expect(result).toEqual(false);
    });

    it("Should return false if hasVertreter is true for different person", async () => {
      const inputData = grundModelFactory
        .eigentuemerPersonGesetzlicherVertreter({ hasVertreter: "false" })
        .eigentuemerPersonGesetzlicherVertreter(
          { hasVertreter: "true" },
          { transient: { personIndex: 1 } }
        )
        .build();
      const result = conditions.hasGesetzlicherVertreter(inputData);
      expect(result).toEqual(false);
    });

    it("Should return true if hasVertreter is true", async () => {
      const inputData = grundModelFactory
        .eigentuemerPersonGesetzlicherVertreter({ hasVertreter: "true" })
        .build();
      const result = conditions.hasGesetzlicherVertreter(inputData);
      expect(result).toEqual(true);
    });
  });

  describe("second eigentuemer", () => {
    it("Should return false if data is undefined", async () => {
      const result = conditions.hasGesetzlicherVertreter(undefined);
      expect(result).toEqual(false);
    });

    describe("with second eigentuemer set to default", () => {
      it("Should return false if hasVertreter is false", async () => {
        const data = grundModelFactory
          .eigentuemerPersonGesetzlicherVertreter({ hasVertreter: "false" })
          .eigentuemerPersonGesetzlicherVertreter(
            { hasVertreter: "false" },
            { transient: { personIndex: 1 } }
          )
          .build();
        const inputData: StateMachineContext = {
          personId: 2,
          ...data,
        };
        const result = conditions.hasGesetzlicherVertreter(inputData);
        expect(result).toEqual(false);
      });

      it("Should return false if hasVertreter is true for different person", async () => {
        const data = grundModelFactory
          .eigentuemerPersonGesetzlicherVertreter({ hasVertreter: "true" })
          .eigentuemerPersonGesetzlicherVertreter(
            { hasVertreter: "false" },
            { transient: { personIndex: 1 } }
          )
          .build();
        const inputData: StateMachineContext = {
          personId: 2,
          ...data,
        };
        const result = conditions.hasGesetzlicherVertreter(inputData);
        expect(result).toEqual(false);
      });

      it("Should return true if hasVertreter is true", async () => {
        const data = grundModelFactory
          .eigentuemerPersonGesetzlicherVertreter({ hasVertreter: "false" })
          .eigentuemerPersonGesetzlicherVertreter(
            { hasVertreter: "true" },
            { transient: { personIndex: 1 } }
          )
          .build();
        const inputData: StateMachineContext = {
          personId: 2,
          ...data,
        };
        const result = conditions.hasGesetzlicherVertreter(inputData);
        expect(result).toEqual(true);
      });
    });
  });
});

describe("repeatPerson", () => {
  describe("eigentuemer anzahl and id not set", () => {
    // TODO I think this should actually throw an error instead of just taking 1 as default?
    it("Should return false if data undefined", async () => {
      const result = conditions.repeatPerson(undefined);
      expect(result).toEqual(false);
    });
  });

  describe("multiple eigentuemer", () => {
    let data: GrundModel;
    beforeEach(() => {
      data = grundModelFactory
        .eigentuemerAnzahl({ anzahl: "2" })
        .eigentuemerPersonGesetzlicherVertreter({ hasVertreter: "false" })
        .build();
    });

    it("Should return true if default data and first eigentuemer", async () => {
      const inputData = { ...data, personId: 1 };
      const result = conditions.repeatPerson(inputData);
      expect(result).toEqual(true);
    });

    it("Should return false if default data and second eigentuemer", async () => {
      const inputData = { ...data, personId: 2 };
      const result = conditions.repeatPerson(inputData);
      expect(result).toEqual(false);
    });
  });

  describe("single eigentuemer", () => {
    it("Should return false if default data and first eigentuemer", async () => {
      const data = grundModelFactory
        .eigentuemerAnzahl({ anzahl: "1" })
        .eigentuemerPersonGesetzlicherVertreter({ hasVertreter: "false" })
        .build();
      const inputData = { ...data, personId: 1 };
      const result = conditions.repeatPerson(inputData);
      expect(result).toEqual(false);
    });
  });
});

describe("hasEmpfangsbevollmaechtigter", () => {
  it("Should return false if data undefined", async () => {
    const result = conditions.hasEmpfangsbevollmaechtigter(undefined);
    expect(result).toEqual(false);
  });

  const cases = [
    { hasEmpfangsvollmacht: "INVALID", expectedValue: false },
    { hasEmpfangsvollmacht: "true", expectedValue: true },
    { hasEmpfangsvollmacht: "false", expectedValue: false },
  ];

  test.each(cases)(
    "Should return $expectedValue if hasEmpfangsvollmacht is hasEmpfangsvollmacht",
    ({ hasEmpfangsvollmacht, expectedValue }) => {
      const inputData = grundModelFactory
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .eigentuemerEmpfangsvollmacht({ hasEmpfangsvollmacht })
        .build();
      const result = conditions.hasEmpfangsbevollmaechtigter(inputData);
      expect(result).toEqual(expectedValue);
    }
  );
});

describe("repeatFlurstueck", () => {
  describe("flurstueck anzahl and id not set", () => {
    // TODO I think this should actually throw an error instead of just taking 1 as default?
    it("Should return false if data undefined", async () => {
      const result = conditions.repeatFlurstueck(undefined);
      expect(result).toEqual(false);
    });
  });

  describe("multiple flurstuecke", () => {
    let data: GrundModel;
    beforeEach(() => {
      data = grundModelFactory.flurstueckAnzahl({ anzahl: "2" }).build();
    });

    it("Should return true if default data and first flurstueck", async () => {
      const inputData = { ...data, flurstueckId: 1 };
      const result = conditions.repeatFlurstueck(inputData);
      expect(result).toEqual(true);
    });

    it("Should return false if default data and second flurstueck", async () => {
      const inputData = { ...data, flurstueckId: 2 };
      const result = conditions.repeatFlurstueck(inputData);
      expect(result).toEqual(false);
    });
  });

  describe("single flurstueck", () => {
    it("Should return false if default data and first flurstueck", async () => {
      const data = grundModelFactory.flurstueckAnzahl({ anzahl: "1" }).build();
      const inputData = { ...data, flurstueckId: 1 };
      const result = conditions.repeatFlurstueck(inputData);
      expect(result).toEqual(false);
    });
  });
});

describe("isBebaut", () => {
  it("Should return false if data undefined", async () => {
    const result = conditions.isBebaut(undefined);
    expect(result).toEqual(false);
  });

  it("Should return false if typ is invalid value", async () => {
    const inputData = grundModelFactory
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .grundstuecktyp({ typ: "INVALID" })
      .build();
    const result = conditions.isBebaut(inputData);
    expect(result).toEqual(false);
  });

  it("Should return false if typ is unbebaut", async () => {
    const inputData = grundModelFactory.bebaut({ bebaut: "unbebaut" }).build();
    const result = conditions.isBebaut(inputData);
    expect(result).toEqual(false);
  });

  it("Should return false if typ is baureif", async () => {
    const inputData = grundModelFactory.bebaut({ bebaut: "baureif" }).build();
    const result = conditions.isBebaut(inputData);
    expect(result).toEqual(false);
  });

  it("Should return true if typ is einfamilienhaus", async () => {
    const inputData = grundModelFactory
      .bebaut({ bebaut: "bebaut" })
      .haustyp({ haustyp: "einfamilienhaus" })
      .build();
    const result = conditions.isBebaut(inputData);
    expect(result).toEqual(true);
  });

  it("Should return true if typ is zweifamilienhaus", async () => {
    const inputData = grundModelFactory
      .bebaut({ bebaut: "bebaut" })
      .haustyp({ haustyp: "zweifamilienhaus" })
      .build();
    const result = conditions.isBebaut(inputData);
    expect(result).toEqual(true);
  });

  it("Should return true if typ is wohnungseigentum", async () => {
    const inputData = grundModelFactory
      .bebaut({ bebaut: "bebaut" })
      .haustyp({ haustyp: "wohnungseigentum" })
      .build();
    const result = conditions.isBebaut(inputData);
    expect(result).toEqual(true);
  });
});

describe("personIdGreaterThanOne", () => {
  it("Should return false if data undefined", async () => {
    const result = conditions.personIdGreaterThanOne(undefined);
    expect(result).toEqual(false);
  });

  it("Should return false if personId is 1 or less", async () => {
    const valuesOneOrLess = [1, "1", "0", 0, "-32", -32];
    valuesOneOrLess.forEach((valueOneOrLess) => {
      const result = conditions.personIdGreaterThanOne({
        ...grundModelFactory.build(),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        personId: valueOneOrLess,
      });
      expect(result).toEqual(false);
    });
  });

  it("Should return true if personId is greater than 1", async () => {
    const valuesGreaterThanOne = [2, "2", "1337", 1337];
    valuesGreaterThanOne.forEach((valueGreaterThanOne) => {
      const result = conditions.personIdGreaterThanOne({
        ...grundModelFactory.build(),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        personId: valueGreaterThanOne,
      });
      expect(result).toEqual(true);
    });
  });
});

describe("flurstueckIdGreaterThanOne", () => {
  it("Should return false if data undefined", async () => {
    const result = conditions.flurstueckIdGreaterThanOne(undefined);
    expect(result).toEqual(false);
  });

  it("Should return false if flurstueckId is 1 or less", async () => {
    const valuesOneOrLess = [1, "1", "0", 0, "-32", -32];
    valuesOneOrLess.forEach((valueOneOrLess) => {
      const result = conditions.flurstueckIdGreaterThanOne({
        ...grundModelFactory.build(),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        flurstueckId: valueOneOrLess,
      });
      expect(result).toEqual(false);
    });
  });

  it("Should return true if flurstueckId is greater than 1", async () => {
    const valuesGreaterThanOne = [2, "2", "1337", 1337];
    valuesGreaterThanOne.forEach((valueGreaterThanOne) => {
      const result = conditions.flurstueckIdGreaterThanOne({
        ...grundModelFactory.build(),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        flurstueckId: valueGreaterThanOne,
      });
      expect(result).toEqual(true);
    });
  });
});

describe("bundeslandIsNW", () => {
  it("Should return false if data undefined", async () => {
    const result = conditions.bundeslandIsNW(undefined);
    expect(result).toEqual(false);
  });

  it("Should return false if bundesland is not NW", async () => {
    const valuesNonNW = [
      "BE",
      "BB",
      "HB",
      "MV",
      "RP",
      "SL",
      "SN",
      "ST",
      "SH",
      "TH",
      undefined,
    ];
    valuesNonNW.forEach((valueNonNW) => {
      const result = conditions.bundeslandIsNW({
        ...grundModelFactory
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .grundstueckAdresse({ bundesland: valueNonNW })
          .build(),
      });
      expect(result).toEqual(false);
    });
  });

  it("Should return true if bundesland is NW", async () => {
    const result = conditions.bundeslandIsNW({
      ...grundModelFactory.grundstueckAdresse({ bundesland: "NW" }).build(),
    });
    expect(result).toEqual(true);
  });
});

describe("isExplicitFlurstueckGrundbuchblattnummer", () => {
  it("Should return false on wohnungseigentum type none", async () => {
    const context = grundModelFactory
      .grundstueckAdresse({ bundesland: "NW" })
      .bebaut({ bebaut: "bebaut" })
      .haustyp({ haustyp: "wohnungseigentum" })
      .miteigentumWohnung({ miteigentumTyp: "none" })
      .build();

    const result = conditions.isExplicitFlurstueckGrundbuchblattnummer(context);

    expect(result).toEqual(false);
  });

  it("Should return false on wohnungseigentum type garage", async () => {
    const context = grundModelFactory
      .grundstueckAdresse({ bundesland: "NW" })
      .bebaut({ bebaut: "bebaut" })
      .haustyp({ haustyp: "wohnungseigentum" })
      .miteigentumWohnung({ miteigentumTyp: "garage" })
      .build();

    const result = conditions.isExplicitFlurstueckGrundbuchblattnummer(context);

    expect(result).toEqual(false);
  });

  it("Should return true on wohnungseigentum type mixed", async () => {
    const context = grundModelFactory
      .grundstueckAdresse({ bundesland: "NW" })
      .bebaut({ bebaut: "bebaut" })
      .haustyp({ haustyp: "wohnungseigentum" })
      .miteigentumWohnung({ miteigentumTyp: "mixed" })
      .build();

    const result = conditions.isExplicitFlurstueckGrundbuchblattnummer(context);

    expect(result).toEqual(true);
  });

  it("Should return true on einfamilienhaus", async () => {
    const context = grundModelFactory
      .grundstueckAdresse({ bundesland: "NW" })
      .bebaut({ bebaut: "bebaut" })
      .haustyp({ haustyp: "einfamilienhaus" })
      .miteigentumHaus({ hasMiteigentum: "true" })
      .build();

    const result = conditions.isExplicitFlurstueckGrundbuchblattnummer(context);

    expect(result).toEqual(true);
  });
});
