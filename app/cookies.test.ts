import { Formular } from "./domain/formular";
import {
  createResponseHeaders,
  formDataCookie,
  getFormDataCookie,
  CookieData,
} from "~/cookies";

describe("getFormDataCookie", () => {
  it("Should handle empty cookie", async () => {
    const request: Request = new Request("/path");
    const cookie: CookieData = await getFormDataCookie(request);

    expect(cookie).toEqual({});
  });

  it("Should return the content of a cookie", async () => {
    const inputCookie: string = await formDataCookie.serialize({
      records: {
        propertyStreet: "Hauptstraße",
        propertyStreetNumber: "42",
      },
    });
    const request: Request = new Request("/path", {
      headers: {
        Cookie: inputCookie,
      },
    });
    const cookie: CookieData = await getFormDataCookie(request);

    expect(Object.keys(cookie).length).toEqual(1);
    expect(Object.keys(cookie.records).length).toEqual(2);
    expect(cookie.records.propertyStreet).toEqual("Hauptstraße");
    expect(cookie.records.propertyStreetNumber).toEqual("42");
  });
});

describe("createResponseHeaders", () => {
  it("Should handle empty data", async () => {
    const inputData = {};
    const cookieHeader: Headers = await createResponseHeaders(inputData);

    expect(await formDataCookie.parse(cookieHeader.get("Set-Cookie"))).toEqual(
      inputData
    );
  });

  it("Should place the given data in the cookie", async () => {
    const inputData = {
      key1: "value1",
      key2: 23,
    };
    const cookieHeader: Headers = await createResponseHeaders(inputData);

    expect(await formDataCookie.parse(cookieHeader.get("Set-Cookie"))).toEqual(
      inputData
    );
  });
});
