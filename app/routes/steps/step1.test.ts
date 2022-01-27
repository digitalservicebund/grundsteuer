import { loader, Step1FormData } from "./step1";
import { formDataCookie } from "~/cookies";

describe("Step 1 Loader", () => {
  it("should handle empty cookie", async () => {
    const response: Step1FormData = await loader({
      request: new Request("/path"),
      params: {},
      context: {},
    });

    expect(response.propertyStreet).toEqual(undefined);
    expect(response.propertyStreetNumber).toEqual(undefined);
  });

  it("should return the sent cookie correctly", async () => {
    const inputCookie: string = await formDataCookie.serialize({
      propertyStreet: "Hauptstraße",
      propertyStreetNumber: "42",
    });

    const response: Step1FormData = await loader({
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
