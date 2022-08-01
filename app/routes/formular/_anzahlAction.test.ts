import { mockActionArgs } from "testUtil/mockActionArgs";
import { mockIsAuthenticated } from "test/mocks/authenticationMocks";
import { grundModelFactory, sessionUserFactory } from "test/factories";
import * as csrfModule from "~/util/csrf";
import * as formDataStorageModule from "~/formDataStorage.server";
import * as stepModule from "~/routes/formular/_step";
import {
  action,
  EIGENTUEMER_ANZAHL_MAX,
  GRUNDSTUECK_ANZAHL_MAX,
} from "~/routes/formular/_anzahlAction";

describe("anzahlAction", () => {
  beforeEach(async () => {
    mockIsAuthenticated.mockImplementation(() =>
      Promise.resolve(sessionUserFactory.build({ id: "1" }))
    );
    const csrfMock = jest.spyOn(csrfModule, "verifyCsrfToken");
    csrfMock.mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const actionArgs = {
    route: "/grundstueck/anzahl",
    formData: {
      anzahl: "1",
    },
    context: {},
    userEmail: "user@example.com",
  };

  describe("without increase or delete buttons being used", () => {
    it("calls the regular step action", async () => {
      const stepActionMock = jest.spyOn(stepModule, "action");
      const args = await mockActionArgs(actionArgs);
      await action(args);
      expect(stepActionMock).toHaveBeenCalledWith(args);
    });
  });

  describe("with increase or delete buttons being used", () => {
    it("does not call the regular step action", async () => {
      const stepActionMock = jest.spyOn(stepModule, "action");
      const args = await mockActionArgs({
        ...actionArgs,
        formData: { increaseButton: "true" },
      });
      await action(args);
      expect(stepActionMock).not.toHaveBeenCalled();
    });

    it("authenticates the user", async () => {
      const args = await mockActionArgs({
        ...actionArgs,
        formData: { deleteButton: "1/2" },
      });
      await action(args);
      expect(mockIsAuthenticated).toHaveBeenCalled();
    });

    it("verifies CSRF token", async () => {
      const verifyCsrfTokenMock = jest.spyOn(csrfModule, "verifyCsrfToken");
      const args = await mockActionArgs({
        ...actionArgs,
        formData: { increaseButton: "true" },
      });
      await action(args);
      expect(verifyCsrfTokenMock).toHaveBeenCalled();
    });

    describe("at route grundstueck/anzahl", () => {
      it("redirects to /formular/grundstueck/anzahl (same page)", async () => {
        const args = await mockActionArgs({
          ...actionArgs,
          formData: { increaseButton: "true" },
        });

        const result = await action(args);
        expect(result.status).toEqual(302);
        expect(result.headers.get("Location")).toEqual(
          "/formular/grundstueck/anzahl"
        );
      });

      describe("with increase button being used", () => {
        it("increases grundstueck anzahl by one", async () => {
          const createHeadersWithFormDataCookieMock = jest.spyOn(
            formDataStorageModule,
            "createHeadersWithFormDataCookie"
          );
          const args = await mockActionArgs({
            ...actionArgs,
            formData: { increaseButton: "true" },
            allData: grundModelFactory.full().build(),
          });

          await action(args);
          expect(createHeadersWithFormDataCookieMock).toHaveBeenCalled();
          const actualArg1 =
            createHeadersWithFormDataCookieMock.mock.calls?.pop()?.[0];
          expect(actualArg1?.data?.grundstueck?.anzahl?.anzahl).toEqual("3");
        });

        it("does not increase grundstueck anzahl above maximum", async () => {
          const createHeadersWithFormDataCookieMock = jest.spyOn(
            formDataStorageModule,
            "createHeadersWithFormDataCookie"
          );
          const args = await mockActionArgs({
            ...actionArgs,
            formData: { increaseButton: "true" },
            allData: {
              grundstueck: {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                anzahl: { anzahl: GRUNDSTUECK_ANZAHL_MAX.toString() },
              },
            },
          });

          await action(args);
          expect(createHeadersWithFormDataCookieMock).toHaveBeenCalled();
          const actualArg1 =
            createHeadersWithFormDataCookieMock.mock.calls?.pop()?.[0];
          expect(actualArg1?.data?.grundstueck?.anzahl?.anzahl).toEqual(
            GRUNDSTUECK_ANZAHL_MAX.toString()
          );
        });

        describe("without anzahl", () => {
          it("assumes one and increases by one", async () => {
            const createHeadersWithFormDataCookieMock = jest.spyOn(
              formDataStorageModule,
              "createHeadersWithFormDataCookie"
            );
            const args = await mockActionArgs({
              ...actionArgs,
              formData: { increaseButton: "true" },
            });

            await action(args);
            expect(createHeadersWithFormDataCookieMock).toHaveBeenCalled();
            const actualArg1 =
              createHeadersWithFormDataCookieMock.mock.calls?.pop()?.[0];
            expect(actualArg1?.data?.grundstueck?.anzahl?.anzahl).toEqual("2");
          });
        });
      });

      describe("with delete button being used", () => {
        it("removes the specified flurstueck", async () => {
          const createHeadersWithFormDataCookieMock = jest.spyOn(
            formDataStorageModule,
            "createHeadersWithFormDataCookie"
          );
          const args = await mockActionArgs({
            ...actionArgs,
            formData: { deleteButton: "1/2" },
            allData: grundModelFactory.full().build(),
          });

          await action(args);
          expect(createHeadersWithFormDataCookieMock).toHaveBeenCalled();
          const actualArg1 =
            createHeadersWithFormDataCookieMock.mock.calls?.pop()?.[0];
          expect(actualArg1?.data?.grundstueck?.flurstueck?.length).toEqual(1);
          // removed the first flurstueck and kept the second one
          expect(
            actualArg1?.data?.grundstueck?.flurstueck?.[0]?.angaben?.gemarkung
          ).toEqual("3");
        });

        it("decreases grundstueck anzahl by one", async () => {
          const createHeadersWithFormDataCookieMock = jest.spyOn(
            formDataStorageModule,
            "createHeadersWithFormDataCookie"
          );
          const args = await mockActionArgs({
            ...actionArgs,
            formData: { deleteButton: "2/2" },
            allData: grundModelFactory.full().build(),
          });

          await action(args);
          expect(createHeadersWithFormDataCookieMock).toHaveBeenCalled();
          const actualArg1 =
            createHeadersWithFormDataCookieMock.mock.calls?.pop()?.[0];
          expect(actualArg1?.data?.grundstueck?.anzahl?.anzahl).toEqual("1");
        });

        it("does not decrease grundstueck anzahl below one", async () => {
          const createHeadersWithFormDataCookieMock = jest.spyOn(
            formDataStorageModule,
            "createHeadersWithFormDataCookie"
          );
          const args = await mockActionArgs({
            ...actionArgs,
            formData: { deleteButton: "1/2" },
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            allData: { grundstueck: { anzahl: { anzahl: "1" } } },
          });

          await action(args);
          expect(createHeadersWithFormDataCookieMock).toHaveBeenCalled();
          const actualArg1 =
            createHeadersWithFormDataCookieMock.mock.calls?.pop()?.[0];
          expect(actualArg1?.data?.grundstueck?.anzahl?.anzahl).toEqual("1");
        });

        describe("without anzahl", () => {
          it("assumes one and does not decrease", async () => {
            const createHeadersWithFormDataCookieMock = jest.spyOn(
              formDataStorageModule,
              "createHeadersWithFormDataCookie"
            );
            const args = await mockActionArgs({
              ...actionArgs,
              formData: { deleteButton: "1/2" },
            });

            await action(args);
            expect(createHeadersWithFormDataCookieMock).toHaveBeenCalled();
            const actualArg1 =
              createHeadersWithFormDataCookieMock.mock.calls?.pop()?.[0];
            expect(actualArg1?.data?.grundstueck?.anzahl?.anzahl).toEqual("1");
          });
        });

        describe("when expected and actual anzahl differ", () => {
          // can happen as we don't really IDs, only indices
          it("does not remove data", async () => {
            const createHeadersWithFormDataCookieMock = jest.spyOn(
              formDataStorageModule,
              "createHeadersWithFormDataCookie"
            );
            const args = await mockActionArgs({
              ...actionArgs,
              route: "/eigentuemer/anzahl",
              // trying to delete entry 1 from a set of 3 entries
              formData: { deleteButton: "1/3" },
              // actual set length is 2
              allData: grundModelFactory.full().build(),
            });

            await action(args);
            expect(createHeadersWithFormDataCookieMock).toHaveBeenCalled();
            const actualArg1 =
              createHeadersWithFormDataCookieMock.mock.calls?.pop()?.[0];
            // nothing was deleted
            expect(actualArg1?.data?.eigentuemer?.person?.length).toEqual(2);
          });
        });
      });
    });

    describe("at route eigentuemer/anzahl", () => {
      it("redirects to /formular/eigentuemer/anzahl (same page)", async () => {
        const args = await mockActionArgs({
          ...actionArgs,
          route: "/eigentuemer/anzahl",
          formData: { deleteButton: "2/7" },
        });

        const result = await action(args);
        expect(result.status).toEqual(302);
        expect(result.headers.get("Location")).toEqual(
          "/formular/eigentuemer/anzahl"
        );
      });

      describe("with increase button being used", () => {
        it("increases eigentuemer anzahl by one", async () => {
          const createHeadersWithFormDataCookieMock = jest.spyOn(
            formDataStorageModule,
            "createHeadersWithFormDataCookie"
          );
          const args = await mockActionArgs({
            ...actionArgs,
            route: "/eigentuemer/anzahl",
            formData: { increaseButton: "true" },
            allData: grundModelFactory.full().build(),
          });

          await action(args);
          expect(createHeadersWithFormDataCookieMock).toHaveBeenCalled();
          const actualArg1 =
            createHeadersWithFormDataCookieMock.mock.calls?.pop()?.[0];
          expect(actualArg1?.data?.eigentuemer?.anzahl?.anzahl).toEqual("3");
        });

        it("does not increase eigentuemer anzahl above maximum", async () => {
          const createHeadersWithFormDataCookieMock = jest.spyOn(
            formDataStorageModule,
            "createHeadersWithFormDataCookie"
          );
          const args = await mockActionArgs({
            ...actionArgs,
            route: "/eigentuemer/anzahl",
            formData: { increaseButton: "true" },
            allData: {
              eigentuemer: {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                anzahl: { anzahl: EIGENTUEMER_ANZAHL_MAX.toString() },
              },
            },
          });

          await action(args);
          expect(createHeadersWithFormDataCookieMock).toHaveBeenCalled();
          const actualArg1 =
            createHeadersWithFormDataCookieMock.mock.calls?.pop()?.[0];
          expect(actualArg1?.data?.eigentuemer?.anzahl?.anzahl).toEqual(
            EIGENTUEMER_ANZAHL_MAX.toString()
          );
        });

        describe("without anzahl", () => {
          it("assumes one and increases by one", async () => {
            const createHeadersWithFormDataCookieMock = jest.spyOn(
              formDataStorageModule,
              "createHeadersWithFormDataCookie"
            );
            const args = await mockActionArgs({
              ...actionArgs,
              route: "/eigentuemer/anzahl",
              formData: { increaseButton: "true" },
            });

            await action(args);
            expect(createHeadersWithFormDataCookieMock).toHaveBeenCalled();
            const actualArg1 =
              createHeadersWithFormDataCookieMock.mock.calls?.pop()?.[0];
            expect(actualArg1?.data?.eigentuemer?.anzahl?.anzahl).toEqual("2");
          });
        });
      });

      describe("with delete button being used", () => {
        it("removes the specified person", async () => {
          const createHeadersWithFormDataCookieMock = jest.spyOn(
            formDataStorageModule,
            "createHeadersWithFormDataCookie"
          );
          const args = await mockActionArgs({
            ...actionArgs,
            route: "/eigentuemer/anzahl",
            formData: { deleteButton: "1/2" },
            allData: grundModelFactory.full().build(),
          });

          await action(args);
          expect(createHeadersWithFormDataCookieMock).toHaveBeenCalled();
          const actualArg1 =
            createHeadersWithFormDataCookieMock.mock.calls?.pop()?.[0];
          expect(actualArg1?.data?.eigentuemer?.person?.length).toEqual(1);
          // removed the first person and kept the second one
          expect(
            actualArg1?.data?.eigentuemer?.person?.[0]?.persoenlicheAngaben
              ?.name
          ).toEqual("2 Name");
        });

        it("decreases eigentuemer anzahl by one", async () => {
          const createHeadersWithFormDataCookieMock = jest.spyOn(
            formDataStorageModule,
            "createHeadersWithFormDataCookie"
          );
          const args = await mockActionArgs({
            ...actionArgs,
            route: "/eigentuemer/anzahl",
            formData: { deleteButton: "2/2" },
            allData: grundModelFactory.full().build(),
          });

          await action(args);
          expect(createHeadersWithFormDataCookieMock).toHaveBeenCalled();
          const actualArg1 =
            createHeadersWithFormDataCookieMock.mock.calls?.pop()?.[0];
          expect(actualArg1?.data?.eigentuemer?.anzahl?.anzahl).toEqual("1");
        });

        it("does not decrease eigentuemer anzahl below one", async () => {
          const createHeadersWithFormDataCookieMock = jest.spyOn(
            formDataStorageModule,
            "createHeadersWithFormDataCookie"
          );
          const args = await mockActionArgs({
            ...actionArgs,
            route: "/eigentuemer/anzahl",
            formData: { deleteButton: "1/2" },
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            allData: { eigentuemer: { anzahl: { anzahl: "1" } } },
          });

          await action(args);
          expect(createHeadersWithFormDataCookieMock).toHaveBeenCalled();
          const actualArg1 =
            createHeadersWithFormDataCookieMock.mock.calls?.pop()?.[0];
          expect(actualArg1?.data?.eigentuemer?.anzahl?.anzahl).toEqual("1");
        });

        describe("without anzahl", () => {
          it("assumes one and does not decrease", async () => {
            const createHeadersWithFormDataCookieMock = jest.spyOn(
              formDataStorageModule,
              "createHeadersWithFormDataCookie"
            );
            const args = await mockActionArgs({
              ...actionArgs,
              route: "/eigentuemer/anzahl",
              formData: { deleteButton: "1/2" },
            });

            await action(args);
            expect(createHeadersWithFormDataCookieMock).toHaveBeenCalled();
            const actualArg1 =
              createHeadersWithFormDataCookieMock.mock.calls?.pop()?.[0];
            expect(actualArg1?.data?.eigentuemer?.anzahl?.anzahl).toEqual("1");
          });
        });

        describe("when expected and actual anzahl differ", () => {
          // can happen as we don't really IDs, only indices
          it("does not remove data", async () => {
            const createHeadersWithFormDataCookieMock = jest.spyOn(
              formDataStorageModule,
              "createHeadersWithFormDataCookie"
            );
            const args = await mockActionArgs({
              ...actionArgs,
              route: "/eigentuemer/anzahl",
              // trying to delete entry 1 from a set of 3 entries
              formData: { deleteButton: "1/3" },
              // actual set length is 2
              allData: grundModelFactory.full().build(),
            });

            await action(args);
            expect(createHeadersWithFormDataCookieMock).toHaveBeenCalled();
            const actualArg1 =
              createHeadersWithFormDataCookieMock.mock.calls?.pop()?.[0];
            // nothing was deleted
            expect(actualArg1?.data?.eigentuemer?.person?.length).toEqual(2);
          });
        });
      });
    });
  });
});
