import { conditions } from "~/domain/guards";
import { StateMachineContext } from "~/domain/states";
import { grundModelFactory } from "test/factories";
import { GrundModel } from "./steps";

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

describe("multipleEigentuemer", () => {
  it("Should return false if data is undefined", async () => {
    const result = conditions.multipleEigentuemer(undefined);
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
      const result = conditions.multipleEigentuemer(inputData);
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
      const result = conditions.multipleEigentuemer(inputData);
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

describe("isBebaut", () => {
  it("Should return false if data undefined", async () => {
    const result = conditions.isBebaut(undefined);
    expect(result).toEqual(false);
  });

  it("Should return false if bebaut is false", async () => {
    const inputData = grundModelFactory
      .grundstueckTyp({ typ: "abweichendeEntwicklung" })
      .build();
    const result = conditions.isBebaut(inputData);
    expect(result).toEqual(false);
  });

  it("Should return true if bebaut is true", async () => {
    const inputData = grundModelFactory
      .grundstueckTyp({ typ: "einfamilienhaus" })
      .build();
    const result = conditions.isBebaut(inputData);
    expect(result).toEqual(true);
  });
});
