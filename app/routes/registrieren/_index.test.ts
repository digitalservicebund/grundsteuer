import { mockActionArgs } from "testUtil/mockActionArgs";
import { userExists } from "~/domain/user";
import { action } from "./index";

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
};

describe("/registrieren action", () => {
  describe('"succeeds"', () => {
    test("and redirects", async () => {
      const args = mockActionArgs({ formData: validFormData, context: {} });
      expect((await action(args)).status).toBe(302);
    });

    test("and redirects to /registrieren/erfolgreich", async () => {
      const args = mockActionArgs({ formData: validFormData, context: {} });
      expect((await action(args)).headers.get("Location")).toBe(
        "/registrieren/erfolgreich"
      );
    });
  });

  describe('"fails"', () => {
    test("with errors when user with email already exists", async () => {
      mockUserExists.mockImplementationOnce(() => Promise.resolve(true));
      const args = mockActionArgs({ formData: validFormData, context: {} });
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
        errors: { email: "errors.required", password: "errors.required" },
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
    ];

    test.each(cases)(
      "with errors when $description",
      async ({ formData, errors }) => {
        const args = mockActionArgs({ formData, context: {} });
        expect(await action(args)).toEqual({ errors });
      }
    );
  });
});
