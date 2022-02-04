import { getNextStepName } from "./getNextStepName";

describe("getNextStepName", () => {
  test("adresse -> bebauung", () => {
    expect(getNextStepName({ currentStepName: "adresse", records: {} })).toBe(
      "bebauung"
    );
  });

  test("bebauung is bebaut -> gebaeude", () => {
    expect(
      getNextStepName({
        currentStepName: "bebauung",
        records: { bebauung: { bebauung: "bebaut" } },
      })
    ).toBe("gebaeude");
  });

  test("skips 'gebaeude' if not bebaut", () => {
    expect(
      getNextStepName({
        currentStepName: "bebauung",
        records: { bebauung: { bebauung: "unbebaut" } },
      })
    ).toBe("zusammenfassung");
  });
});
