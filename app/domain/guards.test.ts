import { defaults } from "~/domain/model";
import { conditions } from "~/domain/guards";
import { StateMachineContext } from "~/domain/states";
import _ from "lodash";

describe("anzahlEigentuemerIsTwo", () => {
  it("Should return false if default data", async () => {
    const result = conditions.anzahlEigentuemerIsTwo(_.cloneDeep(defaults));
    expect(result).toEqual(false);
  });

  it("Should return false if anzahl eigentümer is not 2", async () => {
    const inputData = _.cloneDeep(defaults);
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
    const inputData = _.cloneDeep(defaults);
    _.set(inputData, "eigentuemer.anzahl.anzahl", "2");
    const result = conditions.anzahlEigentuemerIsTwo(inputData);
    expect(result).toEqual(true);
  });
});

describe("multipleEigentuemer", () => {
  it("Should return false if default data", async () => {
    const result = conditions.multipleEigentuemer(_.cloneDeep(defaults));
    expect(result).toEqual(false);
  });

  it("Should return false if anzahl eigentümer is 1 or 0", async () => {
    const inputData = _.cloneDeep(defaults);
    const wrongValues = ["1", "0"];
    wrongValues.forEach((wrongValue) => {
      _.set(inputData, "eigentuemer.anzahl.anzahl", wrongValue);
      const result = conditions.multipleEigentuemer(inputData);
      expect(result).toEqual(false);
    });
  });

  it("Should return true if anzahl eigentümer is 2 or more", async () => {
    const inputData = _.cloneDeep(defaults);
    const correctValues = ["2", "3", "5"];
    correctValues.forEach((correctValue) => {
      _.set(inputData, "eigentuemer.anzahl.anzahl", correctValue);
      const result = conditions.multipleEigentuemer(inputData);
      expect(result).toEqual(true);
    });
  });
});

describe("hasGesetzlicherVertreter", () => {
  describe("eigentuemer id not set", () => {
    let defaultInputData: StateMachineContext;
    beforeEach(() => {
      defaultInputData = _.cloneDeep(defaults);
    });

    // TODO I think this should actually throw an error instead of just taking 1 as default?
    it("Should return false if default data", async () => {
      const result = conditions.hasGesetzlicherVertreter(defaultInputData);
      expect(result).toEqual(false);
    });
  });

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
      _.set(
        inputData,
        "eigentuemer.person.0.gesetzlicherVertreter.hasVertreter",
        "false"
      );
      const result = conditions.hasGesetzlicherVertreter(inputData);
      expect(result).toEqual(false);
    });

    it("Should return false if hasVertreter is true for different person", async () => {
      const inputData: StateMachineContext = defaultInputData;
      _.set(
        inputData,
        "eigentuemer.person.0.gesetzlicherVertreter.hasVertreter",
        "false"
      );
      _.set(inputData, "eigentuemer.person.1", {
        ...inputData?.eigentuemer?.person?.[0],
        gesetzlicherVertreter: {
          hasVertreter: "true",
        },
      });
      const result = conditions.hasGesetzlicherVertreter(inputData);
      expect(result).toEqual(false);
    });

    it("Should return true if hasVertreter is true", async () => {
      const inputData: StateMachineContext = defaultInputData;
      _.set(
        inputData,
        "eigentuemer.person.0.gesetzlicherVertreter.hasVertreter",
        "true"
      );
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
        _.set(
          defaultInputData,
          "eigentuemer.person.1",
          _.cloneDeep(defaultInputData?.eigentuemer?.person?.[0])
        );
      });

      it("Should return false if hasVertreter is false", async () => {
        const inputData: StateMachineContext = defaultInputData;
        _.set(
          inputData,
          "eigentuemer.person.1.gesetzlicherVertreter.hasVertreter",
          "false"
        );
        const result = conditions.hasGesetzlicherVertreter(inputData);
        expect(result).toEqual(false);
      });

      it("Should return false if hasVertreter is true for different person", async () => {
        const inputData: StateMachineContext = defaultInputData;
        _.set(
          inputData,
          "eigentuemer.person.1.gesetzlicherVertreter.hasVertreter",
          "false"
        );
        _.set(inputData, "eigentuemer.person.0", {
          ...inputData?.eigentuemer?.person?.[0],
          gesetzlicherVertreter: {
            hasVertreter: "true",
          },
        });
        const result = conditions.hasGesetzlicherVertreter(inputData);
        expect(result).toEqual(false);
      });

      it("Should return true if hasVertreter is true", async () => {
        const inputData: StateMachineContext = defaultInputData;
        _.set(
          inputData,
          "eigentuemer.person.1.gesetzlicherVertreter.hasVertreter",
          "true"
        );
        const result = conditions.hasGesetzlicherVertreter(inputData);
        expect(result).toEqual(true);
      });
    });
  });
});

describe("repeatPerson", () => {
  describe("eigentuemer anzahl and id not set", () => {
    let defaultInputData: StateMachineContext;
    beforeEach(() => {
      defaultInputData = _.cloneDeep(defaults);
    });

    // TODO I think this should actually throw an error instead of just taking 1 as default?
    it("Should return false if default data", async () => {
      const result = conditions.repeatPerson(defaultInputData);
      expect(result).toEqual(false);
    });
  });

  describe("multiple eigentuemer", () => {
    let defaultInputData: StateMachineContext;
    beforeEach(() => {
      defaultInputData = _.cloneDeep(defaults);
      _.set(defaultInputData, "eigentuemer.anzahl.anzahl", "2");
    });

    it("Should return true if default data and first eigentuemer", async () => {
      const inputData = { ...defaultInputData, currentId: 1 };
      const result = conditions.repeatPerson(inputData);
      expect(result).toEqual(true);
    });

    it("Should return false if default data and second eigentuemer", async () => {
      const inputData = { ...defaultInputData, currentId: 2 };
      const result = conditions.repeatPerson(inputData);
      expect(result).toEqual(false);
    });
  });

  describe("single eigentuemer", () => {
    let defaultInputData: StateMachineContext;
    beforeEach(() => {
      defaultInputData = _.cloneDeep(defaults);
      _.set(defaultInputData, "eigentuemer.anzahl.anzahl", "1");
    });

    it("Should return false if default data and first eigentuemer", async () => {
      const inputData = { ...defaultInputData, currentId: 1 };
      const result = conditions.repeatPerson(inputData);
      expect(result).toEqual(false);
    });
  });
});

describe("showGebaeude", () => {
  it("Should return false if default data", async () => {
    const result = conditions.showGebaeude(_.cloneDeep(defaults));
    expect(result).toEqual(false);
  });

  it("Should return false if bebaut is false", async () => {
    const inputData = _.cloneDeep(defaults);
    _.set(inputData, "grundstueck.bebaut", "false");
    const result = conditions.showGebaeude(inputData);
    expect(result).toEqual(false);
  });

  it("Should return true if bebaut is true", async () => {
    const inputData = _.cloneDeep(defaults);
    _.set(inputData, "grundstueck.bebaut", "true");
    const result = conditions.showGebaeude(inputData);
    expect(result).toEqual(true);
  });
});
