import { db } from "~/db.server";
import {
  createUser,
  deleteEricaRequestIdFscAktivieren,
  deleteEricaRequestIdFscBeantragen,
  deleteEricaRequestIdFscStornieren,
  deleteEricaRequestIdSenden,
  deleteFscRequest,
  deletePdf,
  deleteTransferticket,
  findUserByEmail,
  saveEricaRequestIdFscAktivieren,
  saveEricaRequestIdFscBeantragen,
  saveEricaRequestIdFscStornieren,
  saveEricaRequestIdSenden,
  saveFscRequest,
  savePdf,
  saveTransferticket,
  setUserIdentified,
  setUserInDeclarationProcess,
  userExists,
} from "~/domain/user";

describe("user", () => {
  beforeAll(async () => {
    await db.user.create({
      data: {
        email: "existing@foo.com",
      },
    });

    await db.user.create({
      data: {
        email: "existing_with_fsc_request@foo.com",
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
      const email = "new@foo.com";
      const before = await db.user.findMany({ where: { email: email } });
      expect(before.length).toEqual(0);

      await createUser(email);
      const after = await db.user.findMany({
        where: { email: email },
      });

      expect(after.length).toEqual(1);
    });

    it("should fail on existing email", async () => {
      await expect(async () => {
        await createUser("existing@foo.com");
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

    it("should return user object on existing email not lowercases", async () => {
      const result = await findUserByEmail("eXisTiNG@foO.cOm");

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
      expect(user?.fscRequest?.requestId).toEqual("bar");
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

  describe("deleteFscRequest", () => {
    beforeEach(async () => {
      await db.user.create({
        data: {
          email: "existing_with_fsc_request_to_delete@foo.com",
          fscRequest: {
            create: {
              requestId: "labrador",
            },
          },
        },
      });

      await db.user.create({
        data: {
          email: "different_user@foo.com",
          fscRequest: {
            create: {
              requestId: "terrier",
            },
          },
        },
      });

      await db.user.create({
        data: {
          email: "existing_with_no_fsc_request_to_delete@foo.com",
        },
      });
    });

    afterEach(async () => {
      await db.fscRequest.deleteMany({
        where: { requestId: { in: ["labrador", "terrier"] } },
      });
      await db.user.deleteMany({
        where: {
          email: {
            in: [
              "existing_with_fsc_request_to_delete@foo.com",
              "existing_with_no_fsc_request_to_delete@foo.com",
              "different_user@foo.com",
            ],
          },
        },
      });
    });

    it("should succeed on user with request", async () => {
      await deleteFscRequest(
        "existing_with_fsc_request_to_delete@foo.com",
        "labrador"
      );

      const user = await findUserByEmail(
        "existing_with_fsc_request_to_delete@foo.com"
      );

      expect(user).toBeTruthy();
      expect(user?.fscRequest).toBeFalsy();
    });

    it("should not delete fsc request with different id", async () => {
      await deleteFscRequest(
        "existing_with_fsc_request_to_delete@foo.com",
        "bar"
      );

      const user = await findUserByEmail(
        "existing_with_fsc_request_to_delete@foo.com"
      );

      expect(user).toBeTruthy();
      expect(user?.fscRequest).toBeTruthy();
    });

    it("should not delete fsc request for different user with same request id", async () => {
      await deleteFscRequest("different_user@foo.com", "labrador");

      const user = await findUserByEmail("existing_with_fsc_request@foo.com");

      expect(user).toBeTruthy();
      expect(user?.fscRequest).toBeTruthy();

      const secondUser = await findUserByEmail("different_user@foo.com");

      expect(secondUser).toBeTruthy();
      expect(secondUser?.fscRequest).toBeTruthy();
    });

    it("should succeed on user with no existing request", async () => {
      await deleteFscRequest(
        "existing_with_no_fsc_request_to_delete@foo.com",
        "bar"
      );

      const user = await findUserByEmail(
        "existing_with_no_fsc_request_to_delete@foo.com"
      );

      expect(user).toBeTruthy();
      expect(user?.fscRequest).toBeFalsy();
    });

    it("should fail on unknown user", async () => {
      await expect(async () => {
        await deleteFscRequest("unknown@foo.com", "bar");
      }).rejects.toThrow("not found");
    });
  });

  const unsetEricaRequestIdFscBeantragen = () => {
    db.user.update({
      where: { email: "existing@foo.com" },
      data: { ericaRequestIdFscBeantragen: undefined },
    });
  };

  describe("saveEricaRequestIdFscBeantragen", () => {
    beforeEach(unsetEricaRequestIdFscBeantragen);
    afterEach(unsetEricaRequestIdFscBeantragen);

    it("should store requestId on user", async () => {
      await saveEricaRequestIdFscBeantragen("existing@foo.com", "bar");

      const user = await findUserByEmail("existing@foo.com");

      expect(user).toBeTruthy();
      expect(user?.ericaRequestIdFscBeantragen).toEqual("bar");
    });

    it("should overwrite requestId on user", async () => {
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

  const unsetEricaRequestIdFscAktivieren = () => {
    db.user.update({
      where: { email: "existing@foo.com" },
      data: { ericaRequestIdFscAktivieren: undefined },
    });
  };

  describe("saveEricaRequestIdFscAktivieren", () => {
    beforeEach(unsetEricaRequestIdFscAktivieren);
    afterEach(unsetEricaRequestIdFscAktivieren);

    it("should store requestId on user", async () => {
      await saveEricaRequestIdFscAktivieren("existing@foo.com", "bar");

      const user = await findUserByEmail("existing@foo.com");

      expect(user).toBeTruthy();
      expect(user?.ericaRequestIdFscAktivieren).toEqual("bar");
    });

    it("should overwrite requestId on user", async () => {
      await saveEricaRequestIdFscAktivieren("existing@foo.com", "bar");

      const user = await findUserByEmail("existing@foo.com");

      expect(user).toBeTruthy();
      expect(user?.ericaRequestIdFscAktivieren).toEqual("bar");
    });

    it("should fail on unknown user", async () => {
      await expect(async () => {
        await saveEricaRequestIdFscAktivieren("unknown@foo.com", "bar");
      }).rejects.toThrow("not found");
    });
  });

  describe("deleteEricaRequestIdFscAktivieren", () => {
    beforeEach(unsetEricaRequestIdFscAktivieren);
    afterEach(unsetEricaRequestIdFscAktivieren);

    it("should keep requestId null if user had no request id prior", async () => {
      await deleteEricaRequestIdFscAktivieren("existing@foo.com");

      const user = await findUserByEmail("existing@foo.com");

      expect(user).toBeTruthy();
      expect(user?.ericaRequestIdFscAktivieren).toBeNull();
    });

    it("should delete requestId if user had request id prior", async () => {
      await saveEricaRequestIdFscAktivieren("existing@foo.com", "bar");
      await deleteEricaRequestIdFscAktivieren("existing@foo.com");

      const user = await findUserByEmail("existing@foo.com");

      expect(user).toBeTruthy();
      expect(user?.ericaRequestIdFscAktivieren).toBeNull();
    });

    it("should fail on unknown user", async () => {
      await expect(async () => {
        await deleteEricaRequestIdFscAktivieren("unknown@foo.com");
      }).rejects.toThrow("not found");
    });
  });

  const unsetEricaRequestIdFscStornieren = () => {
    db.user.update({
      where: { email: "existing@foo.com" },
      data: { ericaRequestIdFscStornieren: undefined },
    });
  };

  describe("saveEricaRequestIdFscStornieren", () => {
    beforeEach(unsetEricaRequestIdFscStornieren);
    afterEach(unsetEricaRequestIdFscStornieren);

    it("should store requestId on user", async () => {
      await saveEricaRequestIdFscStornieren("existing@foo.com", "bar");

      const user = await findUserByEmail("existing@foo.com");

      expect(user).toBeTruthy();
      expect(user?.ericaRequestIdFscStornieren).toEqual("bar");
    });

    it("should overwrite requestId on user", async () => {
      await saveEricaRequestIdFscStornieren("existing@foo.com", "bar");

      const user = await findUserByEmail("existing@foo.com");

      expect(user).toBeTruthy();
      expect(user?.ericaRequestIdFscStornieren).toEqual("bar");
    });

    it("should fail on unknown user", async () => {
      await expect(async () => {
        await saveEricaRequestIdFscStornieren("unknown@foo.com", "bar");
      }).rejects.toThrow("not found");
    });
  });

  describe("deleteEricaRequestIdFscStornieren", () => {
    beforeEach(unsetEricaRequestIdFscStornieren);
    afterEach(unsetEricaRequestIdFscStornieren);

    it("should keep requestId null if user had no request id prior", async () => {
      await deleteEricaRequestIdFscStornieren("existing@foo.com");

      const user = await findUserByEmail("existing@foo.com");

      expect(user).toBeTruthy();
      expect(user?.ericaRequestIdFscStornieren).toBeNull();
    });

    it("should delete requestId if user had request id prior", async () => {
      await saveEricaRequestIdFscStornieren("existing@foo.com", "bar");
      await deleteEricaRequestIdFscStornieren("existing@foo.com");

      const user = await findUserByEmail("existing@foo.com");

      expect(user).toBeTruthy();
      expect(user?.ericaRequestIdFscStornieren).toBeNull();
    });

    it("should fail on unknown user", async () => {
      await expect(async () => {
        await deleteEricaRequestIdFscStornieren("unknown@foo.com");
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

  const unsetEricaRequestIdentified = () => {
    db.user.update({
      where: { email: "existing@foo.com" },
      data: { identified: false },
    });
  };

  describe("setUserIdentified", () => {
    beforeEach(unsetEricaRequestIdentified);
    afterEach(unsetEricaRequestIdentified);

    it("should set identified attribute to true if true given as value", async () => {
      await setUserIdentified("existing@foo.com", true);

      const user = await findUserByEmail("existing@foo.com");

      expect(user).toBeTruthy();
      expect(user?.identified).toEqual(true);
    });

    it("should set identified attribute to false if false given as value", async () => {
      await setUserIdentified("existing@foo.com", false);

      const user = await findUserByEmail("existing@foo.com");

      expect(user).toBeTruthy();
      expect(user?.identified).toEqual(false);
    });

    it("should fail on unknown user", async () => {
      await expect(async () => {
        await setUserIdentified("unknown@foo.com", true);
      }).rejects.toThrow("not found");
    });
  });

  const unsetTransferticket = () => {
    db.user.update({
      where: { email: "existing@foo.com" },
      data: { transferticket: undefined },
    });
  };

  describe("saveTransferticket", () => {
    beforeEach(unsetTransferticket);
    afterEach(unsetTransferticket);

    it("should set transferticket attribute to value", async () => {
      const inputTransferticket = "Transfer complete.";
      await saveTransferticket("existing@foo.com", inputTransferticket);

      const user = await findUserByEmail("existing@foo.com");

      expect(user).toBeTruthy();
      expect(user?.transferticket).toEqual(inputTransferticket);
    });

    it("should fail on unknown user", async () => {
      await expect(async () => {
        await saveTransferticket("unknown@foo.com", "Received.");
      }).rejects.toThrow("not found");
    });
  });

  const setTransferticket = () => {
    db.user.update({
      where: { email: "existing@foo.com" },
      data: { transferticket: "test-transfer" },
    });
  };

  describe("deleteTransferticket", () => {
    beforeEach(setTransferticket);
    afterEach(unsetTransferticket);

    it("should set transferticket attribute to value", async () => {
      await deleteTransferticket("existing@foo.com");

      const user = await findUserByEmail("existing@foo.com");

      expect(user).toBeTruthy();
      expect(user?.transferticket).toEqual(null);
    });

    it("should fail on unknown user", async () => {
      await expect(async () => {
        await deleteTransferticket("unknown@foo.com");
      }).rejects.toThrow("not found");
    });
  });

  const unsetPdf = () => {
    db.user.update({
      where: { email: "existing@foo.com" },
      data: { pdf: undefined },
    });
  };

  describe("savePdf", () => {
    beforeEach(unsetPdf);
    afterEach(unsetPdf);

    it("should set pdf attribute to value", async () => {
      const inputPdf = "All your data in one (beautiful) pdf.";
      await savePdf("existing@foo.com", inputPdf);

      const user = await findUserByEmail("existing@foo.com");

      expect(user).toBeTruthy();
      expect(user?.pdf?.data).toEqual(Buffer.from(inputPdf, "base64"));
    });

    it("should fail on unknown user", async () => {
      await expect(async () => {
        await savePdf("unknown@foo.com", "PDF");
      }).rejects.toThrow("not found");
    });
  });

  const setPdf = () => {
    db.user.update({
      where: { email: "existing@foo.com" },
      data: {
        pdf: {
          create: {
            data: Buffer.from("PDF"),
          },
        },
      },
    });
  };

  describe("deletePdf", () => {
    beforeEach(setPdf);
    afterEach(unsetPdf);

    it("should set pdf attribute to value", async () => {
      await deletePdf("existing@foo.com");

      const user = await findUserByEmail("existing@foo.com");

      expect(user).toBeTruthy();
      expect(user?.pdf).toEqual(null);
    });

    it("should fail on unknown user", async () => {
      await expect(async () => {
        await deletePdf("unknown@foo.com");
      }).rejects.toThrow("not found");
    });
  });

  const unsetUserInDeclarationProcess = () => {
    db.user.update({
      where: { email: "existing@foo.com" },
      data: { inDeclarationProcess: true },
    });
  };

  describe("setUserInDeclarationProcess", () => {
    beforeEach(unsetUserInDeclarationProcess);
    afterEach(unsetUserInDeclarationProcess);

    it("should set inDeclarationProcess attribute to true if true given as value", async () => {
      await setUserInDeclarationProcess("existing@foo.com", true);

      const user = await findUserByEmail("existing@foo.com");

      expect(user).toBeTruthy();
      expect(user?.inDeclarationProcess).toEqual(true);
    });

    it("should set inDeclarationProcess attribute to false if false given as value", async () => {
      await setUserInDeclarationProcess("existing@foo.com", false);

      const user = await findUserByEmail("existing@foo.com");

      expect(user).toBeTruthy();
      expect(user?.inDeclarationProcess).toEqual(false);
    });

    it("should fail on unknown user", async () => {
      await expect(async () => {
        await setUserInDeclarationProcess("unknown@foo.com", true);
      }).rejects.toThrow("not found");
    });
  });
});

export {};
