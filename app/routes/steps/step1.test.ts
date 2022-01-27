import { loader } from "./step1";
import { formDataCookie } from "~/cookies";
import { TaxForm } from "../../domain/tax-form";

describe("Step 1 Loader", () => {
  it("should handle empty cookie", async () => {
    const response: TaxForm = await loader({
      request: new Request("/path"),
      params: {},
      context: {},
    });

    expect(response.step1Data).toEqual(undefined);
  });

  it("should return the sent cookie correctly", async () => {
    const inputCookie: string = await formDataCookie.serialize({
      step1Data: {
        propertyStreet: "Hauptstraße",
        propertyStreetNumber: "42",
      },
    });

    const response: TaxForm = await loader({
      request: new Request("/path", {
        headers: {
          Cookie: inputCookie,
        },
      }),
      params: {},
      context: {},
    });

    expect(response.step1Data.propertyStreet).toEqual("Hauptstraße");
    expect(response.step1Data.propertyStreetNumber).toEqual("42");
  });
});
