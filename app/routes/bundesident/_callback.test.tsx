import * as userModule from "~/domain/user";
import * as lifecycleEventsModule from "~/domain/lifecycleEvents.server";
import * as useidModule from "~/useid/useid";
import * as auditLogModule from "~/audit/auditLog";
import { callWithMockedTime, getMockedFunction } from "test/mocks/mockHelper";
import { loader } from "~/routes/bundesident/callback";
import { getLoaderArgsWithAuthenticatedSession } from "test/mocks/authenticationMocks";
import { AuditLogEvent } from "~/audit/auditLog";

let userMock: jest.SpyInstance;

describe("Loader", () => {
  beforeAll(() => {
    userMock = getMockedFunction(userModule, "findUserByEmail", {
      email: "existing_user@foo.com",
      userId: "1234",
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    userMock.mockRestore();
  });

  it("returns error if no resultMajor given in url", async () => {
    const result = await loader(
      await getLoaderArgsWithAuthenticatedSession(
        "/bundesident/callback",
        "existing_user@foo.com"
      )
    );
    expect(result).toEqual({ errorState: true });
  });

  it("returns error if resultMajor is error", async () => {
    const result = await loader(
      await getLoaderArgsWithAuthenticatedSession(
        "/bundesident/callback?ResultMajor=error",
        "existing_user@foo.com"
      )
    );
    expect(result).toEqual({ errorState: true });
  });

  it("returns error if resultMajor is warning", async () => {
    const result = await loader(
      await getLoaderArgsWithAuthenticatedSession(
        "/bundesident/callback?ResultMajor=warning",
        "existing_user@foo.com"
      )
    );
    expect(result).toEqual({ errorState: true });
  });

  describe("with resultMajor being ok", () => {
    it("throws error if no session id given in url", async () => {
      await expect(async () => {
        await loader(
          await getLoaderArgsWithAuthenticatedSession(
            "/bundesident/callback?ResultMajor=ok",
            "existing_user@foo.com"
          )
        );
      }).rejects.toThrowError("Invariant failed: sessionId was not given");
    });

    describe("with correct data returned", () => {
      const originalGetIdentityData = useidModule.useId.getIdentityData;
      const correctUseIdData = {
        firstName: "Rubeus",
        lastName: "Hagrid",
        street: "Hogwartsroad",
        postalCode: "77777",
        city: "Hogsmeade",
        country: "Great Britain",
      };

      beforeAll(() => {
        useidModule.useId.getIdentityData = () =>
          Promise.resolve(correctUseIdData);
      });

      afterAll(() => {
        useidModule.useId.getIdentityData = originalGetIdentityData;
      });

      it("sets user identified", async () => {
        const identifiedMock = jest.spyOn(userModule, "setUserIdentified");
        await loader(
          await getLoaderArgsWithAuthenticatedSession(
            "/bundesident/callback?ResultMajor=ok&sessionId=42",
            "existing_user@foo.com"
          )
        );
        expect(identifiedMock).toHaveBeenCalledWith("existing_user@foo.com");
      });

      it("revokes outstanding fsc requests", async () => {
        const revokeFscMock = jest.spyOn(
          lifecycleEventsModule,
          "revokeOutstandingFSCRequests"
        );
        await loader(
          await getLoaderArgsWithAuthenticatedSession(
            "/bundesident/callback?ResultMajor=ok&sessionId=42",
            "existing_user@foo.com"
          )
        );
        expect(revokeFscMock).toHaveBeenCalledWith({
          email: "existing_user@foo.com",
          userId: "1234",
        });
      });

      it("stores audit log", async () => {
        const saveAuditMock = jest.spyOn(auditLogModule, "saveAuditLog");

        await callWithMockedTime(1652887920227, async () => {
          await loader(
            await getLoaderArgsWithAuthenticatedSession(
              "/bundesident/callback?ResultMajor=ok&sessionId=42",
              "existing_user@foo.com"
            )
          );
        });
        expect(saveAuditMock).toHaveBeenCalledWith({
          eventData: correctUseIdData,
          eventName: AuditLogEvent.IDENTIFIED_VIA_BUNDESIDENT,
          ipAddress: "127.0.0.1",
          timestamp: 1652887920227,
          username: "existing_user@foo.com",
        });
      });

      it("redirects to erfolgreich page", async () => {
        const result = await loader(
          await getLoaderArgsWithAuthenticatedSession(
            "/bundesident/callback?ResultMajor=ok&sessionId=42",
            "existing_user@foo.com"
          )
        );
        expect(result.status).toEqual(302);
        expect(result.headers.get("Location")).toEqual(
          "/bundesident/erfolgreich"
        );
      });
    });
  });
});
