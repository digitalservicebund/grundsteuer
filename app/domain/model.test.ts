import { filterDataForReachablePaths } from "~/domain/model";
import { grundModelFactory } from "test/factories";
import SpyInstance = jest.SpyInstance;

describe("filterDataForReachablePaths", () => {
  describe("with mocked reachablePaths", () => {
    let getPathsMock: SpyInstance<string[], unknown[]>;

    afterEach(() => {
      getPathsMock.mockRestore();
    });

    it("returns only data of reachable paths", () => {
      const reachablePaths = [
        "path.to.here",
        "path.to.undefined",
        "path.there",
      ];
      getPathsMock = jest
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        .spyOn(require("~/domain/graph"), "getReachablePathsFromGrundData")
        .mockImplementation(() => {
          return reachablePaths;
        });

      const completeData = {
        path: {
          to: {
            here: "here",
            undefined: undefined,
          },
          there: "there",
          anywhere: "anywhere",
        },
      };
      const expectedData = {
        path: {
          to: {
            here: "here",
          },
          there: "there",
        },
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const filteredData = filterDataForReachablePaths(completeData);

      expect(filteredData).toEqual(expectedData);
    });

    it("returns handles reachable paths with arrays correctly", () => {
      const reachablePaths = ["path.1.here"];
      getPathsMock = jest
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        .spyOn(require("~/domain/graph"), "getReachablePathsFromGrundData")
        .mockImplementation(() => {
          return reachablePaths;
        });

      const completeData = {
        path: [
          {
            here: "here1",
            there: "there1",
          },
          {
            here: "here2",
            there: "there2",
          },
        ],
      };
      const expectedData = {
        path: [{ here: "here1" }],
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const filteredData = filterDataForReachablePaths(completeData);

      expect(filteredData).toEqual(expectedData);
    });
  });

  it("removes gebaeude data if grundstueck not bebaut", () => {
    const completeData = grundModelFactory
      .grundstueckTyp({ typ: "baureif" })
      .gebaeudeBaujahr({ baujahr: "1990" })
      .build();

    const filteredData = filterDataForReachablePaths(completeData);

    expect(filteredData.gebaeude).toBeUndefined();
  });
});

export {};
