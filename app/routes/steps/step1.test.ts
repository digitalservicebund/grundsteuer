import { action, loader } from "./step1";
import { formDataCookie } from "~/cookies";
import { Step1Data } from "~/domain/formular";

describe("Step 1 Loader", () => {
  it("Should handle empty cookie", async () => {
    const response: Step1Data = await loader({
      request: new Request("/path"),
      params: {},
      context: {},
    });

    expect(response).toEqual({});
  });

  it("Should return the sent cookie correctly", async () => {
    const inputCookie: string = await formDataCookie.serialize({
      step1Data: {
        propertyStreet: "Hauptstraße",
        propertyStreetNumber: "42",
      },
    });

    const response: Step1Data = await loader({
      request: new Request("/path", {
        headers: {
          Cookie: inputCookie,
        },
      }),
      params: {},
      context: {},
    });

    expect(response.propertyStreet).toEqual("Hauptstraße");
    expect(response.propertyStreetNumber).toEqual("42");
  });
});

describe("Step 1 Action", () => {
  let request: Request;
  let testData: Record<string, string>;

  describe("With valid data", () => {
    beforeEach(() => {
      testData = {
        property_street: "Hauptstraße",
        property_street_number: "42",
      };

      const body = new URLSearchParams(testData);

      request = new Request("/path", {
        method: "POST",
        body,
      });
    });

    it("Should redirect to summary page", async () => {
      const response: Response = await action({
        request,
        params: {},
        context: {},
      });

      expect(response.status).toEqual(302);
      expect(response.headers.get("Location")).toEqual(
        "/steps/zusammenfassung"
      );
    });

    it("Should set the cookie correctly", async () => {
      const expectedCookieContent = {
        step1Data: {
          propertyStreet: "Hauptstraße",
          propertyStreetNumber: "42",
        },
      };

      const response: Response = await action({
        request,
        params: {},
        context: {},
      });

      expect(
        await formDataCookie.parse(response.headers.get("Set-Cookie"))
      ).toEqual(expectedCookieContent);
    });
  });
});
