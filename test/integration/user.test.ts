import { db } from "~/db.server";
import bcrypt from "bcryptjs";
import {
  createUser,
  findUserByEmail,
  saveFscRequest,
  userExists,
} from "~/domain/user";

describe("user", () => {
  beforeAll(async () => {
    await db.user.create({
      data: {
        email: "existing@foo.com",
        password: await bcrypt.hash("12345678", 10),
      },
    });
    await db.user.create({
      data: {
        email: "existing_with_fsc_request@foo.com",
        password: await bcrypt.hash("12345678", 10),
        fscRequest: {
          create: {
            requestId: "foo",
          },
        },
      },
    });
  });
  afterAll(async () => {
    await db.fscRequest.deleteMany({
      where: { requestId: { in: ["foo", "bar"] } },
    });
    await db.user.deleteMany({
      where: {
        email: {
          in: ["existing@foo.com", "existing_with_fsc_request@foo.com"],
        },
      },
    });
  });

  describe("createUser", () => {
    it("should succeed on new email", async () => {
      await createUser("new@foo.com", "123");

      const result = await db.user.findMany({
        where: { email: "new@foo.com" },
      });

      expect(result.length).toEqual(1);
    });

    it("should fail on existing email", async () => {
      await expect(async () => {
        await createUser("existing@foo.com", "123");
      }).rejects.toThrow();
    });
  });

  describe("userExists", () => {
    it("should return true on existing user", async () => {
      const result = await userExists("existing@foo.com");

      expect(result).toEqual(true);
    });

    it("should return false on unknown user ", async () => {
      const result = await userExists("unknown@foo.com");

      expect(result).toEqual(false);
    });
  });

  describe("findUserByEmail", () => {
    it("should return null on unknown email", async () => {
      const result = await findUserByEmail("unknown@foo.com");

      expect(result).toBeFalsy();
    });
  });

  describe("saveFscRequest", () => {
    it("should succeed on user with no request", async () => {
      await saveFscRequest("existing@foo.com", "bar");

      const user = await findUserByEmail("existing@foo.com");

      expect(user).toBeTruthy();
      expect(user?.fscRequest).toBeTruthy();
      expect(user?.fscRequest.length).toEqual(1);
      expect(user?.fscRequest[0].requestId).toEqual("bar");
    });

    it("should fail on user with existing request", async () => {
      await expect(async () => {
        await saveFscRequest("existing_with_fsc_request@foo.com", "bar");
      }).rejects.toThrow();
    });
  });
});

export {};
