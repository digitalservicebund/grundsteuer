import * as ericaClientModule from "../../app/erica/ericaClient";
import { updateOpenEricaRequests } from "~/erica/updateOpenEricaRequests.server";
import {
  createUser,
  findUserByEmail,
  saveEricaRequestIdFscAktivieren,
  saveEricaRequestIdFscBeantragen,
  saveEricaRequestIdFscStornieren,
  saveFscRequest,
} from "~/domain/user";
import { db } from "~/db.server";
import { Feature, redis } from "~/redis/redis.server";
import { PRIVATE_KEY } from "test/integration/auditLog.test";
import { decryptData } from "~/audit/crypto";
import { AuditLogEvent } from "~/audit/auditLog";

const cleanUp = async () => {
  const user1 = await findUserByEmail("erica_request_id@test.de");
  const user2 = await findUserByEmail("erica_activation_id@test.de");
  const user3 = await findUserByEmail("erica_revocation_id@test.de");

  await db.fscRequest.deleteMany({
    where: {
      userId: {
        in: [user1?.id || "None", user2?.id || "None", user3?.id || "None"],
      },
    },
  });
  await db.user.deleteMany({
    where: {
      email: {
        in: [
          "erica_request_id@test.de",
          "erica_activation_id@test.de",
          "erica_revocation_id@test.de",
        ],
      },
    },
  });
  await db.auditLogV2.deleteMany({});
  await redis.flushAll();
};
describe("updateOpenEricaRequests", () => {
  beforeAll(() => {
    Date.now = jest.fn(() => Date.UTC(2022, 0, 1, 0, 0, 12));
  });

  beforeEach(async () => {
    await cleanUp();
    await createUser("erica_request_id@test.de");
    await saveEricaRequestIdFscBeantragen(
      "erica_request_id@test.de",
      "erica-request-id"
    );
    await redis.set(
      Feature.CLIENT_IP,
      "erica-request-id",
      "testIpAddress:erica-request-id",
      600
    );
    await createUser("erica_activation_id@test.de");
    await saveEricaRequestIdFscAktivieren(
      "erica_activation_id@test.de",
      "erica-activation-id"
    );
    await redis.set(
      Feature.CLIENT_IP,
      "erica-activation-id",
      "testIpAddress:erica-activation-id",
      600
    );
    await createUser("erica_revocation_id@test.de");
    await saveEricaRequestIdFscStornieren(
      "erica_revocation_id@test.de",
      "erica-revocation-id"
    );
    await saveFscRequest(
      "erica_revocation_id@test.de",
      "alreadyExistingFscRequest"
    );
    await redis.set(
      Feature.CLIENT_IP,
      "erica-revocation-id",
      "testIpAddress:erica-revocation-id",
      600
    );
    jest
      .spyOn(ericaClientModule, "getFromErica")
      .mockImplementation(jest.fn(() => Promise.resolve({})) as jest.Mock);
  });

  afterEach(async () => {
    await cleanUp();
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should perform update if success returned from erica", async () => {
    jest.spyOn(ericaClientModule, "getFromErica").mockImplementation(
      jest.fn((requestUrl: string) => {
        const urlParts = requestUrl.split("/");
        const ericaId = urlParts[urlParts.length - 1];
        if (ericaId == "erica-request-id") {
          return {
            processStatus: "Success",
            result: {
              transferticket: "requestTransferticket",
              taxIdNumber: "012345",
              elsterRequestId: "elsterRequestId",
            },
            errorCode: null,
            errorMessage: null,
          };
        }
        if (ericaId == "erica-activation-id") {
          return {
            processStatus: "Success",
            result: {
              transferticket: "activationTransferticket",
              taxIdNumber: "012345",
            },
            errorCode: null,
            errorMessage: null,
          };
        }
        if (ericaId == "erica-revocation-id")
          return {
            processStatus: "Success",
            result: {
              transferticket: "revocationTransferticket",
            },
            errorCode: null,
            errorMessage: null,
          };
      }) as jest.Mock
    );

    await updateOpenEricaRequests();

    const requestingUser = await findUserByEmail("erica_request_id@test.de");
    const activatingUser = await findUserByEmail("erica_activation_id@test.de");
    const revocatingUser = await findUserByEmail("erica_revocation_id@test.de");

    expect(requestingUser?.ericaRequestIdFscBeantragen).toBeNull();
    expect(requestingUser?.fscRequest?.requestId).toBe("elsterRequestId");
    expect(activatingUser?.ericaRequestIdFscAktivieren).toBeNull();
    expect(activatingUser?.fscRequest).toBeNull();
    expect(revocatingUser?.ericaRequestIdFscStornieren).toBeNull();
    expect(revocatingUser?.fscRequest).toBeNull();

    const auditLogs = await db.auditLogV2.findMany();
    expect(auditLogs.length).toBe(3);
    const decryptedAuditLogs: unknown[] = [];
    auditLogs.forEach((auditLog: any) => {
      decryptedAuditLogs.push(
        JSON.parse(decryptData(auditLog.data, PRIVATE_KEY))
      );
    });

    expect(decryptedAuditLogs).toContainEqual({
      eventName: AuditLogEvent.FSC_REQUESTED,
      timestamp: Date.now(),
      ipAddress: "testIpAddress:erica-request-id",
      username: "erica_request_id@test.de",
      eventData: {
        transferticket: "requestTransferticket",
        steuerId: "012345",
      },
    });

    expect(decryptedAuditLogs).toContainEqual({
      eventName: AuditLogEvent.FSC_ACTIVATED,
      timestamp: Date.now(),
      ipAddress: "testIpAddress:erica-activation-id",
      username: "erica_activation_id@test.de",
      eventData: {
        transferticket: "activationTransferticket",
      },
    });
    expect(decryptedAuditLogs).toContainEqual({
      eventName: AuditLogEvent.FSC_REVOKED,
      timestamp: Date.now(),
      ipAddress: "testIpAddress:erica-revocation-id",
      username: "erica_revocation_id@test.de",
      eventData: {
        transferticket: "revocationTransferticket",
      },
    });
  });

  it("should perform no update if no client Ip address", async () => {
    await redis.del(Feature.CLIENT_IP, "erica-request-id");
    await redis.del(Feature.CLIENT_IP, "erica-activation-id");
    await redis.del(Feature.CLIENT_IP, "erica-revocation-id");

    await updateOpenEricaRequests();

    const requestingUser = await findUserByEmail("erica_request_id@test.de");
    const activatingUser = await findUserByEmail("erica_activation_id@test.de");
    const revocatingUser = await findUserByEmail("erica_revocation_id@test.de");

    expect(requestingUser?.ericaRequestIdFscBeantragen).toEqual(
      "erica-request-id"
    );
    expect(requestingUser?.fscRequest).toBeNull();
    expect(activatingUser?.ericaRequestIdFscAktivieren).toEqual(
      "erica-activation-id"
    );
    expect(activatingUser?.fscRequest).toBeNull();
    expect(revocatingUser?.ericaRequestIdFscStornieren).toEqual(
      "erica-revocation-id"
    );
    expect(revocatingUser?.fscRequest?.requestId).toBe(
      "alreadyExistingFscRequest"
    );
  });

  it("should perform no update if processing returned from erica", async () => {
    const ericaProcessingResponse = {
      processStatus: "Processing",
      result: null,
      errorCode: null,
      errorMessage: null,
    };
    jest
      .spyOn(ericaClientModule, "getFromErica")
      .mockImplementation(
        jest.fn(() => Promise.resolve(ericaProcessingResponse)) as jest.Mock
      );

    await updateOpenEricaRequests();

    const requestingUser = await findUserByEmail("erica_request_id@test.de");
    const activatingUser = await findUserByEmail("erica_activation_id@test.de");
    const revocatingUser = await findUserByEmail("erica_revocation_id@test.de");

    expect(requestingUser?.ericaRequestIdFscBeantragen).toEqual(
      "erica-request-id"
    );
    expect(requestingUser?.fscRequest).toBeNull();
    expect(activatingUser?.ericaRequestIdFscAktivieren).toEqual(
      "erica-activation-id"
    );
    expect(activatingUser?.fscRequest).toBeNull();
    expect(revocatingUser?.ericaRequestIdFscStornieren).toEqual(
      "erica-revocation-id"
    );
    expect(revocatingUser?.fscRequest?.requestId).toBe(
      "alreadyExistingFscRequest"
    );
  });

  it("should perform no update except for revocation request id if an error from erica ", async () => {
    const ericaErrorResponse = {
      errorType: "GENERAL_ERICA_ERROR",
      errorMessage: "Some error ocurred",
    };
    jest
      .spyOn(ericaClientModule, "getFromErica")
      .mockImplementation(
        jest.fn(() => Promise.resolve(ericaErrorResponse)) as jest.Mock
      );

    await updateOpenEricaRequests();

    const requestingUser = await findUserByEmail("erica_request_id@test.de");
    const activatingUser = await findUserByEmail("erica_activation_id@test.de");
    const revocatingUser = await findUserByEmail("erica_revocation_id@test.de");

    expect(requestingUser?.ericaRequestIdFscBeantragen).toEqual(
      "erica-request-id"
    );
    expect(requestingUser?.fscRequest).toBeNull();
    expect(activatingUser?.ericaRequestIdFscAktivieren).toEqual(
      "erica-activation-id"
    );
    expect(activatingUser?.fscRequest).toBeNull();
    expect(revocatingUser?.ericaRequestIdFscStornieren).toBeNull();
    expect(revocatingUser?.fscRequest?.requestId).toBe(
      "alreadyExistingFscRequest"
    );
  });

  it("should only delete erica-request-id if request not found in erica", async () => {
    const ericaErrorResponse = {
      errorType: "EricaRequestNotFound",
      errorMessage: "Could not find request",
    };
    jest
      .spyOn(ericaClientModule, "getFromErica")
      .mockImplementation(
        jest.fn(() => Promise.resolve(ericaErrorResponse)) as jest.Mock
      );

    await updateOpenEricaRequests();

    const requestingUser = await findUserByEmail("erica_request_id@test.de");
    const activatingUser = await findUserByEmail("erica_activation_id@test.de");
    const revocatingUser = await findUserByEmail("erica_revocation_id@test.de");

    expect(requestingUser?.ericaRequestIdFscBeantragen).toBeNull();
    expect(requestingUser?.fscRequest).toBeNull();
    expect(activatingUser?.ericaRequestIdFscAktivieren).toBeNull();
    expect(activatingUser?.fscRequest).toBeNull();
    expect(revocatingUser?.ericaRequestIdFscStornieren).toBeNull();
    expect(revocatingUser?.fscRequest?.requestId).toBe(
      "alreadyExistingFscRequest"
    );
  });
});
