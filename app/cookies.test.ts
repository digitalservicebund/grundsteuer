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
        legacy: {
          adresse: {
            strasse: "Hauptstraße",
            hausnummer: "42",
          },
        },
      },
    });
    const request: Request = new Request("/path", {
      headers: {
        Cookie: inputCookie,
      },
    });
    const cookie: CookieData = await getFormDataCookie(request);

    expect(Object.keys(cookie).length).toEqual(1);
    expect(cookie.records.legacy.adresse.strasse).toEqual("Hauptstraße");
    expect(cookie.records.legacy.adresse.hausnummer).toEqual("42");
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
