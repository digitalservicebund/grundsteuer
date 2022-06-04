import { mockActionArgs } from "testUtil/mockActionArgs";
import { userExists } from "~/domain/user";
import { action } from "./index";
import * as auditLogModule from "~/audit/auditLog";
import { AuditLogEvent } from "~/audit/auditLog";
import * as csrfModule from "~/util/csrf";
import { mockAuthenticate } from "test/mocks/authenticationMocks";

jest.mock("~/domain/user", () => {
  return {
    __esModule: true,
    userExists: jest.fn(),
    createUser: jest.fn(),
  };
});

const mockUserExists = userExists as jest.MockedFunction<typeof userExists>;

const validFormData = {
  email: "user@example.com",
  confirmDataPrivacy: "true",
  confirmTermsOfUse: "true",
};

describe("/registrieren action", () => {
  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mockAuthenticate.mockImplementation(() =>
      Promise.resolve({
        status: 302,
        headers: {
          get: () => "/registrieren/erfolgreich",
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

  describe('"succeeds"', () => {
    test("and saves audit logs", async () => {
      const spyOnSaveAuditLog = jest.spyOn(auditLogModule, "saveAuditLog");
      const args = await mockActionArgs({
        formData: validFormData,
        context: { clientIp: "123" },
      });
      const timestamp = Date.now();
      const actualNowImplementation = Date.now;

      try {
        Date.now = jest.fn(() => timestamp);

        await action(args);

        expect(spyOnSaveAuditLog).toHaveBeenNthCalledWith(1, {
          eventName: AuditLogEvent.USER_REGISTERED,
          timestamp: timestamp,
          ipAddress: "123",
          username: "user@example.com",
        });
        expect(spyOnSaveAuditLog).toHaveBeenNthCalledWith(2, {
          eventName: AuditLogEvent.CONFIRMED_DATA_PRIVACY_REGISTRATION,
          timestamp: timestamp,
          ipAddress: "123",
          username: "user@example.com",
          eventData: { value: "true" },
        });
        expect(spyOnSaveAuditLog).toHaveBeenNthCalledWith(3, {
          eventName: AuditLogEvent.CONFIRMED_TERMS_OF_USE_REGISTRATION,
          timestamp: timestamp,
          ipAddress: "123",
          username: "user@example.com",
          eventData: { value: "true" },
        });
      } finally {
        Date.now = actualNowImplementation;
      }
    });

    test("and redirects", async () => {
      const args = await mockActionArgs({
        formData: validFormData,
        context: {},
      });
      expect((await action(args)).status).toBe(302);
    });

    test("and redirects to /registrieren/erfolgreich", async () => {
      const args = await mockActionArgs({
        formData: validFormData,
        context: {},
      });
      expect((await action(args)).headers.get("Location")).toBe(
        "/registrieren/erfolgreich"
      );
    });

    test("with capitalized email", async () => {
      const args = await mockActionArgs({
        formData: {
          ...validFormData,
          email: "USER@example.Com",
        },
        context: {},
      });
      expect((await action(args)).headers.get("Location")).toBe(
        "/registrieren/erfolgreich"
      );
    });
  });

  describe('"fails"', () => {
    test("without errors when user with email already exists", async () => {
      mockUserExists.mockImplementationOnce(() => Promise.resolve(true));
      const args = await mockActionArgs({
        formData: validFormData,
        context: {},
      });
      expect((await action(args)).headers.get("Location")).toBe(
        "/registrieren/erfolgreich"
      );
    });

    test("and does not save audit logs", async () => {
      const spyOnSaveAuditLog = jest.spyOn(auditLogModule, "saveAuditLog");
      const args = await mockActionArgs({
        formData: {
          email: "",
        },
        context: { clientIp: "123" },
      });

      await action(args);

      expect(spyOnSaveAuditLog).not.toHaveBeenCalled();
    });

    const cases = [
      {
        description: "form fields are empty",
        formData: {
          email: "",
        },
        errors: {
          email: "errors.required",
          confirmDataPrivacy: "errors.required",
          confirmTermsOfUse: "errors.required",
        },
      },
      {
        description: "email has wrong format",
        formData: {
          ...validFormData,
          email: "user@example",
        },
        errors: { email: "errors.email.wrongFormat" },
      },
      {
        description: "data privacy not confirmed",
        formData: {
          ...validFormData,
          confirmDataPrivacy: "",
        },
        errors: { confirmDataPrivacy: "errors.required" },
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
});
