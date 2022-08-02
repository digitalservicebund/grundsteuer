import { mockActionArgs } from "testUtil/mockActionArgs";
import { action } from "./index";
import * as csrfModule from "~/util/csrf";
import { mockAuthenticate } from "test/mocks/authenticationMocks";

describe("/anmelden action", () => {
  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mockAuthenticate.mockImplementation(() =>
      Promise.resolve({
        status: 302,
        headers: {
          get: () => "/formular/welcome",
        },
      })
    );
  });

  beforeEach(async () => {
    const csrfMock = jest.spyOn(csrfModule, "verifyCsrfToken");
    csrfMock.mockImplementation(() => Promise.resolve());
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  describe('"fails"', () => {
    const cases = [
      {
        description: "no email provided",
        formData: {
          email: "",
        },
        errors: {
          email: "errors.required",
        },
      },
      {
        description: "email has wrong format",
        formData: {
          email: "user@example",
        },
        errors: { email: "errors.email.wrongFormat" },
      },
    ];

    test.each(cases)(
      "with errors when $description",
      async ({ formData, errors }) => {
        const args = await mockActionArgs({ formData, context: {} });
        expect(await action(args)).toEqual({ errors });
      }
    );
  });

  it("Succeeds with correct mail address", async () => {
    const args = await mockActionArgs({
      formData: {
        email: "user@example.de",
      },
      context: {},
    });
    const response = await action(args);
    expect(response.status).toEqual(302);
  });
});
