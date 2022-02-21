import { defaults } from "~/domain/model";
import { conditions } from "~/domain/guards";

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
