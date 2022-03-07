import { getPathsFromState } from "./getPathsFromState";

describe("getPathsFromState", () => {
  test("simple case", () => {
    const state = {
      toStrings: jest.fn().mockReturnValue(["foo.bar"]),
      matches: jest.fn().mockReturnValue(false),
    };
    expect(getPathsFromState({ state })).toEqual({
      path: "foo.bar",
      pathWithId: "foo.bar",
    });
  });

  describe("when state matches 'eigentuemer.person'", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state: any = {
      toStrings: () => ["eigentuemer.person.adresse"],
      matches: (val: string) => val === "eigentuemer.person",
    };

    describe("without context", () => {
      test("returns path with id 1", () => {
        expect(getPathsFromState({ state })).toEqual({
          path: "eigentuemer.person.adresse",
          pathWithId: "eigentuemer.person.1.adresse",
        });
      });
    });

    describe("with context", () => {
      test("returns path with id 5", () => {
        state.context = { personId: 5 };
        expect(getPathsFromState({ state })).toEqual({
          path: "eigentuemer.person.adresse",
          pathWithId: "eigentuemer.person.5.adresse",
        });
      });
    });
  });

  describe("when state matches 'grundstueck.flurstueck'", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state: any = {
      toStrings: () => ["grundstueck.flurstueck.angaben"],
      matches: (val: string) => val === "grundstueck.flurstueck",
    };

    describe("without context", () => {
      test("returns path with id 1", () => {
        expect(getPathsFromState({ state })).toEqual({
          path: "grundstueck.flurstueck.angaben",
          pathWithId: "grundstueck.flurstueck.1.angaben",
        });
      });
    });

    describe("with context", () => {
      test("returns path with id 5", () => {
        state.context = { flurstueckId: 5 };
        expect(getPathsFromState({ state })).toEqual({
          path: "grundstueck.flurstueck.angaben",
          pathWithId: "grundstueck.flurstueck.5.angaben",
        });
      });
    });
  });
});
