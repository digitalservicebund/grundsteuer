import {
  createFormGraph,
  getReachablePaths,
  Graph,
} from "~/domain/states/graph.server";

describe("createFormGraph", () => {
  describe("with empty data", () => {
    it("returns an empty object for enabled step", () => {
      const result = createFormGraph({ machineContext: {} });
      expect((result.eigentuemer as Graph).anzahl).toEqual({
        data: undefined,
        path: "eigentuemer.anzahl",
        pathWithId: "eigentuemer.anzahl",
      });
    });

    it("returns only steps for person 1", () => {
      const result = createFormGraph({ machineContext: {} });
      expect((result.eigentuemer as Graph).person).toHaveLength(1);
      expect(
        ((result.eigentuemer as Graph).person as Graph[])[0].adresse
      ).toEqual({
        data: undefined,
        path: "eigentuemer.person.adresse",
        pathWithId: "eigentuemer.person.1.adresse",
      });
    });

    it("includes steps that have empty data set", () => {
      const result = createFormGraph({ machineContext: { welcome: {} } });
      expect(result.welcome).toEqual({
        data: {},
        path: "welcome",
        pathWithId: "welcome",
      });
    });
  });
});

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
