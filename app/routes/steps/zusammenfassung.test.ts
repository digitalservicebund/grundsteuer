import { loader } from "./zusammenfassung";
import { formDataCookie } from "~/cookies";

describe("Loader", () => {
  it("Should return form data cookie", async () => {
    const cookie = {
      cookie: {
        foo: "bar",
      },
    };

    const inputCookie: string = await formDataCookie.serialize(cookie);
    const loaderData = await loader({
      request: new Request("/path", {
        headers: {
          Cookie: inputCookie,
        },
      }),
      params: {},
      context: {},
    });

    expect(loaderData.formData).toEqual(cookie);
  });
});
