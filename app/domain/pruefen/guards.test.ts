import { pruefenConditions } from "~/domain/pruefen/guards";

describe("guards", () => {
  const cases = [
    { guard: pruefenConditions.isEigentuemer },
    { guard: pruefenConditions.isPrivatperson },
    { guard: pruefenConditions.isBundesmodelBundesland },
    { guard: pruefenConditions.isNotAusland },
    { guard: pruefenConditions.isNotFremderBoden },
    { guard: pruefenConditions.isNotBeguenstigung },
  ];

  test.each(cases)(
    "$guard should return false if data is undefined",
    ({ guard }) => {
      const result = guard(undefined);
      expect(result).toEqual(false);
    }
  );
});
