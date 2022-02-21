import { defaults } from "~/domain/model";
import { conditions } from "~/domain/guards";
import { StateMachineContext } from "~/domain/states";
import _ from "lodash";

describe("anzahlEigentuemerIsTwo", () => {
  it("Should return false if default data", async () => {
    const result = conditions.anzahlEigentuemerIsTwo(defaults);
    expect(result).toEqual(false);
  });

  it("Should return false if anzahl eigentümer is not 2", async () => {
    const inputData = defaults;
    const wrongValues = ["1", undefined, "hi", 3];
    wrongValues.forEach((wrongValue) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      inputData.eigentuemer.anzahl.anzahl = wrongValue;
      const result = conditions.anzahlEigentuemerIsTwo(inputData);
      expect(result).toEqual(false);
    });
  });

  it("Should return true if anzahl eigentümer is 2", async () => {
    const inputData = defaults;
    inputData.eigentuemer.anzahl.anzahl = "2";
    const result = conditions.anzahlEigentuemerIsTwo(inputData);
    expect(result).toEqual(true);
  });
});

describe("multipleEigentuemer", () => {
  it("Should return true if default data", async () => {
    const result = conditions.multipleEigentuemer(defaults);
    expect(result).toEqual(true);
  });

  it("Should return false if anzahl eigentümer is 1 or 0", async () => {
    const inputData = defaults;
    const wrongValues = ["1", "0"];
    wrongValues.forEach((wrongValue) => {
      inputData.eigentuemer.anzahl.anzahl = wrongValue;
      const result = conditions.multipleEigentuemer(inputData);
      expect(result).toEqual(false);
    });
  });

  it("Should return true if anzahl eigentümer is 2 or more", async () => {
    const inputData = defaults;
    const correctValues = ["2", "3", "10"];
    correctValues.forEach((correctValue) => {
      inputData.eigentuemer.anzahl.anzahl = correctValue;
      const result = conditions.multipleEigentuemer(inputData);
      expect(result).toEqual(true);
    });
  });
});

describe("hasGesetzlicherVertreter", () => {
  describe("first eigentuemer", () => {
    let defaultInputData: StateMachineContext;
    beforeEach(() => {
      defaultInputData = { ..._.cloneDeep(defaults), currentId: 1 };
    });

    it("Should return false if default data", async () => {
      const result = conditions.hasGesetzlicherVertreter(defaultInputData);
      expect(result).toEqual(false);
    });

    it("Should return false if hasVertreter is false", async () => {
      const inputData: StateMachineContext = defaultInputData;
      inputData.eigentuemer.person[0].gesetzlicherVertreter.hasVertreter =
        "false";
      const result = conditions.hasGesetzlicherVertreter(inputData);
      expect(result).toEqual(false);
    });

    it("Should return false if hasVertreter is true for different person", async () => {
      const inputData: StateMachineContext = defaultInputData;
      inputData.eigentuemer.person[0].gesetzlicherVertreter.hasVertreter =
        "false";
      inputData.eigentuemer.person[1] = {
        ...inputData.eigentuemer.person[0],
        gesetzlicherVertreter: {
          hasVertreter: "true",
        },
      };
      const result = conditions.hasGesetzlicherVertreter(inputData);
      expect(result).toEqual(false);
    });

    it("Should return true if hasVertreter is true", async () => {
      const inputData: StateMachineContext = defaultInputData;
      inputData.eigentuemer.person[0].gesetzlicherVertreter.hasVertreter =
        "true";
      const result = conditions.hasGesetzlicherVertreter(inputData);
      expect(result).toEqual(true);
    });
  });

  describe("second eigentuemer", () => {
    let defaultInputData: StateMachineContext;
    beforeEach(() => {
      defaultInputData = { ..._.cloneDeep(defaults), currentId: 2 };
    });

    it("Should return false if default data", async () => {
      const result = conditions.hasGesetzlicherVertreter(defaultInputData);
      expect(result).toEqual(false);
    });

    describe("with second eigentuemer set to default", () => {
      beforeEach(() => {
        defaultInputData.eigentuemer.person[1] = _.cloneDeep(
          defaultInputData.eigentuemer.person[0]
        );
      });

      it("Should return false if hasVertreter is false", async () => {
        const inputData: StateMachineContext = defaultInputData;
        inputData.eigentuemer.person[1].gesetzlicherVertreter.hasVertreter =
          "false";
        const result = conditions.hasGesetzlicherVertreter(inputData);
        expect(result).toEqual(false);
      });

      it("Should return false if hasVertreter is true for different person", async () => {
        const inputData: StateMachineContext = defaultInputData;
        inputData.eigentuemer.person[1].gesetzlicherVertreter.hasVertreter =
          "false";
        inputData.eigentuemer.person[0] = {
          ...inputData.eigentuemer.person[0],
          gesetzlicherVertreter: {
            hasVertreter: "true",
          },
        };
        const result = conditions.hasGesetzlicherVertreter(inputData);
        expect(result).toEqual(false);
      });

      it("Should return true if hasVertreter is true", async () => {
        const inputData: StateMachineContext = defaultInputData;
        inputData.eigentuemer.person[1].gesetzlicherVertreter.hasVertreter =
          "true";
        const result = conditions.hasGesetzlicherVertreter(inputData);
        expect(result).toEqual(true);
      });
    });
  });
});
