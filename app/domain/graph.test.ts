import { getReachablePaths, Graph } from "~/domain/graph";

describe("getReachablePaths", () => {
  describe("with simple graph", function () {
    const graph: Graph = {
      page: {
        path: "path",
        pathWithId: "path.1",
        data: {},
      },
    };

    it("Should return correct paths", async () => {
      const result = getReachablePaths({ graph, initialPaths: [] });
      expect(result).toEqual(["path.1"]);
    });

    it("Should return correct paths when initial given", async () => {
      const result = getReachablePaths({ graph, initialPaths: ["initial"] });
      expect(result).toEqual(["initial", "path.1"]);
    });
  });

  describe("with nested graph", function () {
    const graph: Graph = {
      parent: {
        page: {
          path: "path",
          pathWithId: "path.1",
          data: {},
        },
      },
    };

    it("Should return correct paths", async () => {
      const result = getReachablePaths({ graph, initialPaths: [] });
      expect(result).toEqual(["path.1"]);
    });

    describe("with multiple children", function () {
      const graphMultipleChildren: Graph = {
        parent: {
          page1: {
            path: "path1",
            pathWithId: "path1.1",
            data: {},
          },
          page2: {
            path: "path2",
            pathWithId: "path2.1",
            data: {},
          },
        },
      };
      it("Should return correct paths", async () => {
        const result = getReachablePaths({
          graph: graphMultipleChildren,
          initialPaths: [],
        });
        expect(result).toEqual(["path1.1", "path2.1"]);
      });
    });

    describe("with list", function () {
      const graphWithList: Graph = {
        parent: {
          list: [
            {
              page1: {
                path: "path1",
                pathWithId: "path1.1",
                data: {},
              },
            },
            {
              page2: {
                path: "path2",
                pathWithId: "path2.1",
                data: {},
              },
            },
          ],
        },
      };
      it("Should return correct paths", async () => {
        const result = getReachablePaths({
          graph: graphWithList,
          initialPaths: [],
        });
        expect(result).toEqual(["path1.1", "path2.1"]);
      });
    });
  });
});
