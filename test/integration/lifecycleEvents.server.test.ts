import {
  createUser,
  findUserByEmail,
  saveEricaRequestIdFscAktivieren,
  saveEricaRequestIdFscBeantragen,
  saveFscRequest,
  setUserIdentified,
} from "~/domain/user";
import { db } from "~/db.server";
import {
  saveSuccessfulFscActivationData,
  saveSuccessfullFscRequestData,
} from "~/domain/lifecycleEvents.server";
import { PRIVATE_KEY } from "test/integration/auditLog.test";
import { decryptData } from "~/audit/crypto";
import { AuditLogEvent } from "~/audit/auditLog";

const cleanUpDatabase = async () => {
  const user1 = await findUserByEmail("existing_fsc_request@foo.com");
  const user2 = await findUserByEmail("without_fsc_request@foo.com");
  await db.fscRequest.deleteMany({
    where: { userId: { in: [user1?.id || "None", user2?.id || "None"] } },
  });
  await db.user.deleteMany({
    where: {
      email: {
        in: [
          "existing_fsc_request@foo.com",
          "without_fsc_request@foo.com",
          "not_identified@foo.com",
          "identified@foo.com",
        ],
      },
    },
  });
  await db.auditLog.deleteMany({});
};

describe("saveSuccessfullFscRequestData", () => {
  const currentDate = Date.UTC(2022, 0, 1, 0, 0, 12);
  const actualDateNowImplementation = Date.now;

  beforeAll(() => {
    Date.now = jest.fn(() => currentDate);
  });

  afterEach(async () => {
    await cleanUpDatabase();
  });

  afterAll(() => {
    Date.now = actualDateNowImplementation;
  });
  describe("with existing fsc", () => {
    beforeEach(async () => {
      await cleanUpDatabase();

      await createUser("existing_fsc_request@foo.com");
      await saveFscRequest("existing_fsc_request@foo.com", "foo");
      await saveEricaRequestIdFscBeantragen(
        "existing_fsc_request@foo.com",
        "iAmAnId1234"
      );
    });

    it("should update user with correct erica id", async () => {
      await saveSuccessfullFscRequestData(
        "existing_fsc_request@foo.com",
        "iAmAnId1234",
        "localhost",
        "newRequestId",
        "transferticket007",
        "04903837828"
      );

      const updatedUser = await findUserByEmail("existing_fsc_request@foo.com");

      expect(updatedUser?.fscRequest?.requestId).toBe("newRequestId");
      expect(updatedUser?.ericaRequestIdFscBeantragen).toBeNull();
    });

    it("should not update User with incorrect Erica id", async () => {
      await saveSuccessfullFscRequestData(
        "existing_fsc_request@foo.com",
        "INCORRECT",
        "localhost",
        "newRequestId",
        "transferticket007",
        "04903837828"
      );

      const updatedUser = await findUserByEmail("existing_fsc_request@foo.com");

      expect(updatedUser?.fscRequest?.requestId).toBe("foo");
      expect(updatedUser?.ericaRequestIdFscBeantragen).toBe("iAmAnId1234");
    });

    it("should add an audit log entry", async () => {
      await saveSuccessfullFscRequestData(
        "existing_fsc_request@foo.com",
        "iAmAnId1234",
        "localhost",
        "newRequestId",
        "transferticket007",
        "04903837828"
      );

      const auditLogs = await db.auditLog.findMany();
      const lastAuditLog = JSON.parse(
        decryptData(auditLogs[auditLogs.length - 1].data, PRIVATE_KEY)
      );

      expect(lastAuditLog).toEqual({
        eventName: AuditLogEvent.FSC_REQUESTED,
        timestamp: Date.now(),
        ipAddress: "localhost",
        username: "existing_fsc_request@foo.com",
        eventData: {
          transferticket: "transferticket007",
          steuerId: "04903837828",
        },
      });
    });

    it("should not add an audit log entry if incorrect Erica id", async () => {
      await saveSuccessfullFscRequestData(
        "existing_fsc_request@foo.com",
        "Incorrect",
        "localhost",
        "newRequestId",
        "transferticket007",
        "04903837828"
      );

      const auditLogs = await db.auditLog.findMany();
      expect(auditLogs.length).toBe(0);
    });
  });

  describe("without existing fsc", () => {
    beforeEach(async () => {
      await cleanUpDatabase();

      await createUser("without_fsc_request@foo.com");
      await saveEricaRequestIdFscBeantragen(
        "without_fsc_request@foo.com",
        "iAmAnIdToo"
      );
    });

    it("should update user with correct erica id", async () => {
      await saveSuccessfullFscRequestData(
        "without_fsc_request@foo.com",
        "iAmAnIdToo",
        "localhost",
        "newRequestId",
        "transferticket007",
        "04903837828"
      );

      const updatedUser = await findUserByEmail("without_fsc_request@foo.com");

      expect(updatedUser?.fscRequest?.requestId).toBe("newRequestId");
      expect(updatedUser?.ericaRequestIdFscBeantragen).toBeNull();
    });

    it("should not update user with incorrect Erica id", async () => {
      await saveSuccessfullFscRequestData(
        "without_fsc_request@foo.com",
        "INCORRECT",
        "localhost",
        "newRequestId",
        "transferticket007",
        "04903837828"
      );

      const updatedUser = await findUserByEmail("without_fsc_request@foo.com");

      expect(updatedUser?.fscRequest).toBeNull();
      expect(updatedUser?.ericaRequestIdFscBeantragen).toBe("iAmAnIdToo");
    });

    it("should add an audit log entry", async () => {
      await saveSuccessfullFscRequestData(
        "without_fsc_request@foo.com",
        "iAmAnIdToo",
        "localhost",
        "newRequestId",
        "transferticket007",
        "04903837828"
      );

      const auditLogs = await db.auditLog.findMany();
      const lastAuditLog = JSON.parse(
        decryptData(auditLogs[auditLogs.length - 1].data, PRIVATE_KEY)
      );

      expect(lastAuditLog).toEqual({
        eventName: AuditLogEvent.FSC_REQUESTED,
        timestamp: Date.now(),
        ipAddress: "localhost",
        username: "without_fsc_request@foo.com",
        eventData: {
          transferticket: "transferticket007",
          steuerId: "04903837828",
        },
      });
    });

    it("should not add an audit log entry if incorrect Erica id", async () => {
      await saveSuccessfullFscRequestData(
        "without_fsc_request@foo.com",
        "Incorrect",
        "localhost",
        "newRequestId",
        "transferticket007",
        "04903837828"
      );

      const auditLogs = await db.auditLog.findMany();
      expect(auditLogs.length).toBe(0);
    });
  });
});

describe("saveSuccessfullFscActivationData", () => {
  const currentDate = Date.UTC(2022, 0, 1, 0, 0, 12);
  const actualDateNowImplementation = Date.now;

  beforeAll(() => {
    Date.now = jest.fn(() => currentDate);
  });

  afterEach(async () => {
    await cleanUpDatabase();
  });

  afterAll(() => {
    Date.now = actualDateNowImplementation;
  });

  describe("with an unidentified user", () => {
    beforeEach(async () => {
      await cleanUpDatabase();

      await createUser("not_identified@foo.com");
      await saveEricaRequestIdFscAktivieren(
        "not_identified@foo.com",
        "iAmAnId"
      );
    });

    it("should update user with correct erica id", async () => {
      await saveSuccessfulFscActivationData(
        "not_identified@foo.com",
        "iAmAnId",
        "localhost",
        "transferticket007"
      );

      const updatedUser = await findUserByEmail("not_identified@foo.com");

      expect(updatedUser?.identified).toBe(true);
      expect(updatedUser?.ericaRequestIdFscAktivieren).toBeNull();
    });

    it("should not update user with incorrect Erica id", async () => {
      await saveSuccessfulFscActivationData(
        "not_identified@foo.com",
        "INCORRECT",
        "localhost",
        "transferticket007"
      );

      const updatedUser = await findUserByEmail("not_identified@foo.com");

      expect(updatedUser?.identified).toBe(false);
      expect(updatedUser?.ericaRequestIdFscAktivieren).toBe("iAmAnId");
    });

    it("should add an audit log entry", async () => {
      await saveSuccessfulFscActivationData(
        "not_identified@foo.com",
        "iAmAnId",
        "localhost",
        "transferticket007"
      );

      const auditLogs = await db.auditLog.findMany();
      const lastAuditLog = JSON.parse(
        decryptData(auditLogs[auditLogs.length - 1].data, PRIVATE_KEY)
      );

      expect(lastAuditLog).toEqual({
        eventName: AuditLogEvent.FSC_ACTIVATED,
        timestamp: Date.now(),
        ipAddress: "localhost",
        username: "not_identified@foo.com",
        eventData: {
          transferticket: "transferticket007",
        },
      });
    });

    it("should not add an audit log entry if incorrect Erica id", async () => {
      await saveSuccessfulFscActivationData(
        "not_identified@foo.com",
        "Incorrect",
        "localhost",
        "transferticket007"
      );

      const auditLogs = await db.auditLog.findMany();
      expect(auditLogs.length).toBe(0);
    });
  });

  describe("with an identified user", () => {
    beforeEach(async () => {
      await cleanUpDatabase();

      await createUser("identified@foo.com");
      await setUserIdentified("identified@foo.com");
      await saveEricaRequestIdFscAktivieren("identified@foo.com", "iAmAnId");
    });

    it("should update user with correct erica id", async () => {
      await saveSuccessfulFscActivationData(
        "identified@foo.com",
        "iAmAnId",
        "localhost",
        "transferticket007"
      );

      const updatedUser = await findUserByEmail("identified@foo.com");

      expect(updatedUser?.identified).toBe(true);
      expect(updatedUser?.ericaRequestIdFscAktivieren).toBeNull();
    });

    it("should add an audit log entry", async () => {
      await saveSuccessfulFscActivationData(
        "identified@foo.com",
        "iAmAnId",
        "localhost",
        "transferticket007"
      );

      const auditLogs = await db.auditLog.findMany();
      const lastAuditLog = JSON.parse(
        decryptData(auditLogs[auditLogs.length - 1].data, PRIVATE_KEY)
      );

      expect(lastAuditLog).toEqual({
        eventName: AuditLogEvent.FSC_ACTIVATED,
        timestamp: Date.now(),
        ipAddress: "localhost",
        username: "identified@foo.com",
        eventData: {
          transferticket: "transferticket007",
        },
      });
    });
  });
});
