import { mockActionArgs } from "testUtil/mockActionArgs";
import { userExists } from "~/domain/user";
import { action } from "./index";
import * as auditLogModule from "~/audit/auditLog";
import { AuditLogEvent } from "~/audit/auditLog";
import * as csrfModule from "~/util/csrf";
import { verifyCsrfToken } from "~/util/csrf";

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
  emailRepeated: "user@example.com",
  password: "12345678",
  passwordRepeated: "12345678",
  confirmDataPrivacy: "true",
  confirmTermsOfUse: "true",
};

describe("/registrieren action", () => {
  beforeEach(async () => {
    const csrfMock = jest.spyOn(csrfModule, "verifyCsrfToken");
    csrfMock.mockImplementation(() => Promise.resolve());
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  describe('"succeeds"', () => {
    test("and saves audit log", async () => {
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
          emailRepeated: "user@example.com",
        },
        context: {},
      });
      expect((await action(args)).headers.get("Location")).toBe(
        "/registrieren/erfolgreich"
      );
    });
  });

  describe('"fails"', () => {
    test("with errors when user with email already exists", async () => {
      mockUserExists.mockImplementationOnce(() => Promise.resolve(true));
      const args = await mockActionArgs({
        formData: validFormData,
        context: {},
      });
      const errors = { email: "errors.email.alreadyExists" };
      expect(await action(args)).toEqual({ errors });
    });

    const cases = [
      {
        description: "form fields are empty",
        formData: {
          email: "",
          emailRepeated: "",
          password: "",
          passwordRepeated: "",
        },
        errors: {
          email: "errors.required",
          password: "errors.required",
          confirmDataPrivacy: "errors.required",
          confirmTermsOfUse: "errors.required",
        },
      },
      {
        description: "email has wrong format",
        formData: {
          ...validFormData,
          email: "user@example",
          emailRepeated: "user@example",
        },
        errors: { email: "errors.email.wrongFormat" },
      },
      {
        description: "email does not match repeated email",
        formData: {
          ...validFormData,
          emailRepeated: "user@example.org",
        },
        errors: { emailRepeated: "errors.email.notMatching" },
      },
      {
        description: "password is too short",
        formData: {
          ...validFormData,
          password: "1234567",
          passwordRepeated: "1234567",
        },
        errors: { password: "errors.password.tooShort" },
      },
      {
        description: "password is too long",
        formData: {
          ...validFormData,
          password: "#".repeat(65),
          passwordRepeated: "#".repeat(65),
        },
        errors: { password: "errors.password.tooLong" },
      },
      {
        description: "password does not match repeated password",
        formData: {
          ...validFormData,
          password: "123456789",
        },
        errors: { passwordRepeated: "errors.password.notMatching" },
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
