import {
  createUser,
  findUserByEmail,
  saveEricaRequestIdFscAktivieren,
  saveEricaRequestIdFscBeantragen,
  saveEricaRequestIdFscStornieren,
  saveFscRequest,
  setUserIdentified,
} from "~/domain/user";
import { db } from "~/db.server";
import {
  saveSuccessfulFscActivationData,
  saveSuccessfulFscRequestData,
  saveSuccessfulFscRevocationData,
} from "~/domain/lifecycleEvents.server";
import { PRIVATE_KEY } from "test/integration/auditLog.test";
import { decryptData } from "~/audit/crypto";
import { AuditLogEvent } from "~/audit/auditLog";

const cleanUpDatabase = async () => {
  const user1Id =
    (await findUserByEmail("existing_fsc_request@foo.com"))?.id || "None";
  const user2Id =
    (await findUserByEmail("without_fsc_request@foo.com"))?.id || "None";
  const user3Id = (await findUserByEmail("identified@foo.com"))?.id || "None";
  const user4Id =
    (await findUserByEmail("not_identified@foo.com"))?.id || "None";
  await db.fscRequest.deleteMany({
    where: { userId: { in: [user1Id, user2Id, user3Id, user4Id] } },
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
  await db.auditLogV2.deleteMany({});
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
      await saveSuccessfulFscRequestData(
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
      await saveSuccessfulFscRequestData(
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
      await saveSuccessfulFscRequestData(
        "existing_fsc_request@foo.com",
        "iAmAnId1234",
        "localhost",
        "newRequestId",
        "transferticket007",
        "04903837828"
      );

      const auditLogs = await db.auditLogV2.findMany();
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
      await saveSuccessfulFscRequestData(
        "existing_fsc_request@foo.com",
        "Incorrect",
        "localhost",
        "newRequestId",
        "transferticket007",
        "04903837828"
      );

      const auditLogs = await db.auditLogV2.findMany();
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
      await saveSuccessfulFscRequestData(
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
      await saveSuccessfulFscRequestData(
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
      await saveSuccessfulFscRequestData(
        "without_fsc_request@foo.com",
        "iAmAnIdToo",
        "localhost",
        "newRequestId",
        "transferticket007",
        "04903837828"
      );

      const auditLogs = await db.auditLogV2.findMany();
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
      await saveSuccessfulFscRequestData(
        "without_fsc_request@foo.com",
        "Incorrect",
        "localhost",
        "newRequestId",
        "transferticket007",
        "04903837828"
      );

      const auditLogs = await db.auditLogV2.findMany();
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

      const auditLogs = await db.auditLogV2.findMany();
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

      const auditLogs = await db.auditLogV2.findMany();
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

      const auditLogs = await db.auditLogV2.findMany();
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

describe("saveSuccessfullFscRevocationData", () => {
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
      await saveEricaRequestIdFscStornieren(
        "not_identified@foo.com",
        "iAmAnId"
      );
      await saveFscRequest(
        "not_identified@foo.com",
        "alreadyExistingFscRequest"
      );
    });

    it("should update user with correct erica id", async () => {
      await saveSuccessfulFscRevocationData(
        "not_identified@foo.com",
        "iAmAnId",
        "localhost",
        "transferticket007"
      );

      const updatedUser = await findUserByEmail("not_identified@foo.com");

      expect(updatedUser?.identified).toBe(false);
      expect(updatedUser?.ericaRequestIdFscStornieren).toBeNull();
      expect(updatedUser?.fscRequest).toBeNull();
    });

    it("should not update user with incorrect Erica id", async () => {
      await saveSuccessfulFscRevocationData(
        "not_identified@foo.com",
        "INCORRECT",
        "localhost",
        "transferticket007"
      );

      const updatedUser = await findUserByEmail("not_identified@foo.com");

      expect(updatedUser?.identified).toBe(false);
      expect(updatedUser?.ericaRequestIdFscStornieren).toBe("iAmAnId");
      expect(updatedUser?.fscRequest?.requestId).toBe(
        "alreadyExistingFscRequest"
      );
    });

    it("should add an audit log entry", async () => {
      await saveSuccessfulFscRevocationData(
        "not_identified@foo.com",
        "iAmAnId",
        "localhost",
        "transferticket007"
      );

      const auditLogs = await db.auditLogV2.findMany();
      const lastAuditLog = JSON.parse(
        decryptData(auditLogs[auditLogs.length - 1].data, PRIVATE_KEY)
      );

      expect(lastAuditLog).toEqual({
        eventName: AuditLogEvent.FSC_REVOKED,
        timestamp: Date.now(),
        ipAddress: "localhost",
        username: "not_identified@foo.com",
        eventData: {
          transferticket: "transferticket007",
        },
      });
    });

    it("should not add an audit log entry if incorrect Erica id", async () => {
      await saveSuccessfulFscRevocationData(
        "not_identified@foo.com",
        "Incorrect",
        "localhost",
        "transferticket007"
      );

      const auditLogs = await db.auditLogV2.findMany();
      expect(auditLogs.length).toBe(0);
    });
  });

  describe("with an identified user", () => {
    beforeEach(async () => {
      await cleanUpDatabase();

      await createUser("identified@foo.com");
      await setUserIdentified("identified@foo.com");
      await saveEricaRequestIdFscStornieren("identified@foo.com", "iAmAnId");
      await saveFscRequest("identified@foo.com", "alreadyExistingFscRequest");
    });

    it("should update user with correct erica id", async () => {
      await saveSuccessfulFscRevocationData(
        "identified@foo.com",
        "iAmAnId",
        "localhost",
        "transferticket007"
      );

      const updatedUser = await findUserByEmail("identified@foo.com");

      expect(updatedUser?.identified).toBe(true);
      expect(updatedUser?.ericaRequestIdFscStornieren).toBeNull();
      expect(updatedUser?.fscRequest).toBeNull();
    });

    it("should add an audit log entry", async () => {
      await saveSuccessfulFscRevocationData(
        "identified@foo.com",
        "iAmAnId",
        "localhost",
        "transferticket007"
      );

      const auditLogs = await db.auditLogV2.findMany();
      const lastAuditLog = JSON.parse(
        decryptData(auditLogs[auditLogs.length - 1].data, PRIVATE_KEY)
      );

      expect(lastAuditLog).toEqual({
        eventName: AuditLogEvent.FSC_REVOKED,
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
