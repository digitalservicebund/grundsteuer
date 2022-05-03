import { db } from "~/db.server";
import bcrypt from "bcryptjs";
import {
  createUser,
  deleteEricaRequestIdFscBeantragen,
  deleteEricaRequestIdSenden,
  findUserByEmail,
  saveEricaRequestIdFscBeantragen,
  saveEricaRequestIdSenden,
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

  const unsetEricaRequestIdFscBeantragen = () => {
    db.user.update({
      where: { email: "existing@foo.com" },
      data: { ericaRequestIdFscBeantragen: undefined },
    });
  };

  describe("createUser", () => {
    it("should succeed on new email", async () => {
      const email = "new@foo.com";
      const before = await db.user.findMany({ where: { email: email } });
      expect(before.length).toEqual(0);

      await createUser(email, "123");
      const after = await db.user.findMany({
        where: { email: email },
      });

      expect(after.length).toEqual(1);
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

      expect(result).toBeNull();
    });

    it("should return user object on existing email", async () => {
      const result = await findUserByEmail("existing@foo.com");

      expect(result).toEqual(
        expect.objectContaining({ email: "existing@foo.com" })
      );
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

    it("should fail on unknown user", async () => {
      await expect(async () => {
        await saveFscRequest("unknown@foo.com", "bar");
      }).rejects.toThrow("not found");
    });
  });

  describe("saveEricaRequestIdFscBeantragen", () => {
    beforeEach(unsetEricaRequestIdFscBeantragen);
    afterEach(unsetEricaRequestIdFscBeantragen);

    it("should store requestId on user", async () => {
      await saveEricaRequestIdFscBeantragen("existing@foo.com", "bar");

      const user = await findUserByEmail("existing@foo.com");

      expect(user).toBeTruthy();
      expect(user?.ericaRequestIdFscBeantragen).toEqual("bar");
    });

    it("should fail on unknown user", async () => {
      await expect(async () => {
        await saveEricaRequestIdFscBeantragen("unknown@foo.com", "bar");
      }).rejects.toThrow("not found");
    });
  });

  describe("deleteEricaRequestIdFscBeantragen", () => {
    beforeEach(unsetEricaRequestIdFscBeantragen);
    afterEach(unsetEricaRequestIdFscBeantragen);

    it("should keep requestId null if user had no request id prior", async () => {
      await deleteEricaRequestIdFscBeantragen("existing@foo.com");

      const user = await findUserByEmail("existing@foo.com");

      expect(user).toBeTruthy();
      expect(user?.ericaRequestIdFscBeantragen).toBeNull();
    });

    it("should delete requestId if user had request id prior", async () => {
      await saveEricaRequestIdFscBeantragen("existing@foo.com", "bar");
      await deleteEricaRequestIdFscBeantragen("existing@foo.com");

      const user = await findUserByEmail("existing@foo.com");

      expect(user).toBeTruthy();
      expect(user?.ericaRequestIdFscBeantragen).toBeNull();
    });

    it("should fail on unknown user", async () => {
      await expect(async () => {
        await deleteEricaRequestIdFscBeantragen("unknown@foo.com");
      }).rejects.toThrow("not found");
    });
  });

  const unsetEricaRequestIdSenden = () => {
    db.user.update({
      where: { email: "existing@foo.com" },
      data: { ericaRequestIdSenden: undefined },
    });
  };

  describe("saveEricaRequestIdSenden", () => {
    beforeEach(unsetEricaRequestIdSenden);
    afterEach(unsetEricaRequestIdSenden);

    it("should store requestId on user", async () => {
      await saveEricaRequestIdSenden("existing@foo.com", "bar");

      const user = await findUserByEmail("existing@foo.com");

      expect(user).toBeTruthy();
      expect(user?.ericaRequestIdSenden).toEqual("bar");
    });

    it("should fail on unknown user", async () => {
      await expect(async () => {
        await saveEricaRequestIdSenden("unknown@foo.com", "bar");
      }).rejects.toThrow("not found");
    });
  });

  describe("deleteEricaRequestIdSenden", () => {
    beforeEach(unsetEricaRequestIdSenden);
    afterEach(unsetEricaRequestIdSenden);

    it("should keep requestId null if user had no request id prior", async () => {
      await deleteEricaRequestIdSenden("existing@foo.com");

      const user = await findUserByEmail("existing@foo.com");

      expect(user).toBeTruthy();
      expect(user?.ericaRequestIdSenden).toBeNull();
    });

    it("should delete requestId if user had request id prior", async () => {
      await saveEricaRequestIdSenden("existing@foo.com", "bar");
      await deleteEricaRequestIdSenden("existing@foo.com");

      const user = await findUserByEmail("existing@foo.com");

      expect(user).toBeTruthy();
      expect(user?.ericaRequestIdSenden).toBeNull();
    });

    it("should fail on unknown user", async () => {
      await expect(async () => {
        await deleteEricaRequestIdSenden("unknown@foo.com");
      }).rejects.toThrow("not found");
    });
  });
});

export {};
