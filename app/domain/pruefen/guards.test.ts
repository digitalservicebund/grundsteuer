import { pruefenConditions } from "~/domain/pruefen/guards";

describe("guards", () => {
  const cases = [
    { guard: pruefenConditions.isPrivatperson },
    { guard: pruefenConditions.isNoErbengemeinschaft },
    { guard: pruefenConditions.isBundesmodelBundesland },
    { guard: pruefenConditions.isEligibleGrundstueckArt },
    { guard: pruefenConditions.isEligibleGarage },
    { guard: pruefenConditions.isNotAusland },
    { guard: pruefenConditions.isNotFremderBoden },
    { guard: pruefenConditions.isNotBeguenstigung },
    { guard: pruefenConditions.hasNoElster },
  ];

  test.each(cases)(
    "$guard should return false if data is undefined",
    ({ guard }) => {
      const result = guard(undefined);
      expect(result).toEqual(false);
    }
  );
});
