import * as auditLogModule from "~/audit/auditLog";
import * as userModule from "~/domain/user";
import * as samlServerModule from "~/ekona/saml.server";
import * as freischaltCodeStornierenModule from "~/erica/freischaltCodeStornieren";
import {
  getMockedFunction,
  getThrowingMockedFunction,
} from "test/mocks/mockHelper";
import { AuditLogEvent } from "~/audit/auditLog";
import { action } from "./callback";
import { mockActionArgs } from "testUtil/mockActionArgs";
import {
  commitEkonaSession,
  getEkonaSession,
} from "~/ekona/ekonaCookie.server";

const callWithMockedTime = async (timestamp: number, callback: () => void) => {
  const actualNowImplementation = Date.now;
  try {
    Date.now = jest.fn(() => timestamp);
    await callback();
  } finally {
    Date.now = actualNowImplementation;
  }
};
let userMock: jest.SpyInstance;

describe("Action", () => {
  beforeAll(() => {
    userMock = getMockedFunction(userModule, "findUserById", {
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

  it("should redirect to ekona if user interruption error found during validation", async () => {
    const ekonaSession = await getEkonaSession(null);
    ekonaSession.set("userId", "123456");
    getThrowingMockedFunction(samlServerModule, "validateSamlResponse", {
      xmlStatus:
        '<Status><StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Requester"><StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:AuthnFailed"/></StatusCode><StatusMessage>Die ELSTER-seitige Authentifizierung wurde durch den Benutzer abgebrochen.</StatusMessage></Status>',
    });
    await callWithMockedTime(1652887920227, async () => {
      const result = await action(
        await mockActionArgs({
          route: "/ekona/callback",
          formData: {
            SAMLResponse: "PLACEHOLDER_SAML_RESPONSE",
          },
          context: {},
          userEmail: "existing_user@foo.com",
          allData: {},
          explicitCookie: await commitEkonaSession(ekonaSession),
        })
      );
      expect(result.status).toEqual(302);
      expect(result.headers.get("location")).toEqual("/ekona");
    });
  });

  it("should throw if different error found during validation", async () => {
    const ekonaSession = await getEkonaSession(null);
    ekonaSession.set("userId", "123456");
    getThrowingMockedFunction(
      samlServerModule,
      "validateSamlResponse",
      Error("Different error")
    );
    const spyOnSetUserIdentified = jest.spyOn(userModule, "setUserIdentified");
    const spyOnSaveAuditLog = jest.spyOn(auditLogModule, "saveAuditLog");

    await callWithMockedTime(1652887920227, async () => {
      await expect(async () => {
        await action(
          await mockActionArgs({
            route: "/ekona/callback",
            formData: {
              SAMLResponse: "<xml>This is just a mock placeholder</xml>",
            },
            context: {},
            userEmail: "existing_user@foo.com",
            allData: {},
            explicitCookie: await commitEkonaSession(ekonaSession),
          })
        );
      }).rejects.toThrow();
      expect(spyOnSetUserIdentified).not.toHaveBeenCalled();
      expect(spyOnSaveAuditLog).not.toHaveBeenCalled();
    });
    spyOnSetUserIdentified.mockClear();
    spyOnSaveAuditLog.mockClear();
  });

  it("should not identify if user interruption error found during validation", async () => {
    const ekonaSession = await getEkonaSession(null);
    ekonaSession.set("userId", "123456");
    getThrowingMockedFunction(samlServerModule, "validateSamlResponse", {
      xmlStatus:
        '<Status><StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Requester"><StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:AuthnFailed"/></StatusCode><StatusMessage>Die ELSTER-seitige Authentifizierung wurde durch den Benutzer abgebrochen.</StatusMessage></Status>',
    });

    const spyOnSetUserIdentified = jest.spyOn(userModule, "setUserIdentified");
    const spyOnSaveAuditLog = jest.spyOn(auditLogModule, "saveAuditLog");

    await callWithMockedTime(1652887920227, async () => {
      await action(
        await mockActionArgs({
          route: "/ekona/callback",
          formData: {
            SAMLResponse: "PLACEHOLDER_SAML_RESPONSE",
          },
          context: {},
          userEmail: "existing_user@foo.com",
          allData: {},
          explicitCookie: await commitEkonaSession(ekonaSession),
        })
      );
      expect(spyOnSetUserIdentified).not.toHaveBeenCalled();
      expect(spyOnSaveAuditLog).not.toHaveBeenCalled();
    });
    spyOnSetUserIdentified.mockClear();
    spyOnSaveAuditLog.mockClear();
  });

  it("should set used identified if data validates", async () => {
    const ekonaData = {
      profile: {
        IdNr: "59477301287",
        Vorname: "James",
        Name: "Bond",
        Geburstdatum: "04.01.1900",
        Anschrift: {
          Typ: [{ _: "Ausland" }],
          Strasse: [{ _: "Bakerstreet" }],
          Hausnummer: [{ _: "007" }],
          Ort: [{ _: "London" }],
          Land: [{ _: "UK" }],
        },
      },
    };
    const ekonaSession = await getEkonaSession(null);
    ekonaSession.set("userId", "123456");
    getMockedFunction(samlServerModule, "validateSamlResponse", ekonaData);
    const spyOnSetUserIdentified = jest.spyOn(userModule, "setUserIdentified");

    await callWithMockedTime(1652887920227, async () => {
      await action(
        await mockActionArgs({
          route: "/ekona/callback",
          formData: {
            SAMLResponse: "<xml>This is just a mock placeholder</xml>",
          },
          context: {},
          userEmail: "existing_user@foo.com",
          allData: {},
          explicitCookie: await commitEkonaSession(ekonaSession),
        })
      );

      expect(spyOnSetUserIdentified).toHaveBeenCalledWith(
        "existing_user@foo.com",
        true
      );
    });
    spyOnSetUserIdentified.mockClear();
  });

  it("should not identify if data validates but is incomplete", async () => {
    const ekonaData = {
      profile: {
        IdNr: "59477301287",
        Vorname: "James",
        Name: "Bond",
        Geburstdatum: "04.01.1900",
        Anschrift: {
          Typ: [{ _: "Ausland" }],
          Hausnummer: [{ _: "007" }],
          Ort: [{ _: "London" }],
          Land: [{ _: "UK" }],
        },
      },
    };
    const ekonaSession = await getEkonaSession(null);
    ekonaSession.set("userId", "123456");
    getMockedFunction(samlServerModule, "validateSamlResponse", ekonaData);
    const spyOnSetUserIdentified = jest.spyOn(userModule, "setUserIdentified");
    const spyOnSaveAuditLog = jest.spyOn(auditLogModule, "saveAuditLog");

    await callWithMockedTime(1652887920227, async () => {
      await expect(async () => {
        await action(
          await mockActionArgs({
            route: "/ekona/callback",
            formData: {
              SAMLResponse: "<xml>This is just a mock placeholder</xml>",
            },
            context: {},
            userEmail: "existing_user@foo.com",
            allData: {},
            explicitCookie: await commitEkonaSession(ekonaSession),
          })
        );
      }).rejects.toThrow();

      expect(spyOnSetUserIdentified).not.toHaveBeenCalled();
      expect(spyOnSaveAuditLog).not.toHaveBeenCalled();
    });
    spyOnSetUserIdentified.mockClear();
    spyOnSaveAuditLog.mockClear();
  });

  it("should save audit log if data validates", async () => {
    const expectedClientIp = "123.007";
    const ekonaData = {
      profile: {
        IdNr: "59477301287",
        Vorname: "James",
        Name: "Bond",
        Geburstdatum: "04.01.1900",
        Anschrift: {
          Typ: [{ _: "Ausland" }],
          Strasse: [{ _: "Bakerstreet" }],
          Hausnummer: [{ _: "007" }],
          Ort: [{ _: "London" }],
          Land: [{ _: "UK" }],
        },
      },
    };
    const ekonaSession = await getEkonaSession(null);
    ekonaSession.set("userId", "123456");
    getMockedFunction(samlServerModule, "validateSamlResponse", ekonaData);
    const spyOnSaveAuditLog = jest.spyOn(auditLogModule, "saveAuditLog");

    await callWithMockedTime(1652887920227, async () => {
      await action(
        await mockActionArgs({
          route: "/ekona/callback",
          formData: {
            SAMLResponse: "<xml>This is just a mock placeholder</xml>",
          },
          context: { clientIp: expectedClientIp },
          userEmail: "existing_user@foo.com",
          allData: {},
          explicitCookie: await commitEkonaSession(ekonaSession),
        })
      );

      expect(spyOnSaveAuditLog).toHaveBeenCalledWith({
        eventName: AuditLogEvent.IDENTIFIED_VIA_EKONA,
        timestamp: Date.now(),
        ipAddress: expectedClientIp,
        username: "existing_user@foo.com",
        eventData: {
          idnr: "59477301287",
          firstName: "James",
          lastName: "Bond",
          street: "Bakerstreet",
          housenumber: "007",
          postalCode: undefined,
          addressSupplement: undefined,
          city: "London",
          country: "UK",
        },
      });
    });
    spyOnSaveAuditLog.mockClear();
  });

  describe("with user in ongoing fsc activation", () => {
    beforeAll(() => {
      userMock = getMockedFunction(userModule, "findUserById", {
        email: "existing_user@foo.com",
        userId: "12346",
        fscRequest: { requestId: "foo" },
      });
      getMockedFunction(
        freischaltCodeStornierenModule,
        "revokeFreischaltCode",
        { location: "007" }
      );
      getMockedFunction(userModule, "deleteFscRequest", {});
    });

    afterAll(() => {
      userMock.mockRestore();
    });

    it("should identify if data validates", async () => {
      const ekonaData = {
        profile: {
          IdNr: "59477301287",
          Vorname: "James",
          Name: "Bond",
          Geburstdatum: "04.01.1900",
          Anschrift: {
            Typ: [{ _: "Ausland" }],
            Strasse: [{ _: "Bakerstreet" }],
            Hausnummer: [{ _: "007" }],
            Ort: [{ _: "London" }],
            Land: [{ _: "UK" }],
          },
        },
      };
      const ekonaSession = await getEkonaSession(null);
      ekonaSession.set("userId", "123456");
      getMockedFunction(samlServerModule, "validateSamlResponse", ekonaData);
      const spyOnSetUserIdentified = jest.spyOn(
        userModule,
        "setUserIdentified"
      );
      const spyOnSaveAuditLog = jest.spyOn(auditLogModule, "saveAuditLog");

      await callWithMockedTime(1652887920227, async () => {
        await action(
          await mockActionArgs({
            route: "/ekona/callback",
            formData: {
              SAMLResponse: "<xml>This is just a mock placeholder</xml>",
            },
            context: {},
            userEmail: "existing_user@foo.com",
            allData: {},
            explicitCookie: await commitEkonaSession(ekonaSession),
          })
        );
        expect(spyOnSetUserIdentified).toHaveBeenCalledWith(
          "existing_user@foo.com",
          true
        );
        expect(spyOnSaveAuditLog).toHaveBeenCalled();
      });
      spyOnSetUserIdentified.mockClear();
      spyOnSaveAuditLog.mockClear();
    });

    it("should revoke fsc request", async () => {
      const ekonaData = {
        profile: {
          IdNr: "59477301287",
          Vorname: "James",
          Name: "Bond",
          Geburstdatum: "04.01.1900",
          Anschrift: {
            Typ: [{ _: "Ausland" }],
            Strasse: [{ _: "Bakerstreet" }],
            Hausnummer: [{ _: "007" }],
            Ort: [{ _: "London" }],
            Land: [{ _: "UK" }],
          },
        },
      };
      const ekonaSession = await getEkonaSession(null);
      ekonaSession.set("userId", "123456");
      getMockedFunction(samlServerModule, "validateSamlResponse", ekonaData);
      const spyOnRevokeFsc = jest.spyOn(
        freischaltCodeStornierenModule,
        "revokeFscForUser"
      );

      await callWithMockedTime(1652887920227, async () => {
        await action(
          await mockActionArgs({
            route: "/ekona/callback",
            formData: {
              SAMLResponse: "<xml>This is just a mock placeholder</xml>",
            },
            context: {},
            userEmail: "existing_user@foo.com",
            allData: {},
            explicitCookie: await commitEkonaSession(ekonaSession),
          })
        );
        expect(spyOnRevokeFsc).toHaveBeenCalled();
      });
      spyOnRevokeFsc.mockClear();
    });

    it("should not revoke fsc request if identification fails", async () => {
      const ekonaData = {
        profile: {
          IdNr: "59477301287",
          Vorname: "James",
          Name: "Bond",
          Geburstdatum: "04.01.1900",
          Anschrift: {
            Typ: [{ _: "Ausland" }],
            Strasse: [{ _: "Bakerstreet" }],
            Hausnummer: [{ _: "007" }],
            Ort: [{ _: "London" }],
            Land: [{ _: "UK" }],
          },
        },
      };
      getMockedFunction(samlServerModule, "validateSamlResponse", ekonaData);
      const ekonaSession = await getEkonaSession(null);
      ekonaSession.set("userId", "123456");
      getThrowingMockedFunction(
        userModule,
        "setUserIdentified",
        Error("fail identification")
      );
      const spyOnRevokeFsc = jest.spyOn(
        freischaltCodeStornierenModule,
        "revokeFscForUser"
      );

      await callWithMockedTime(1652887920227, async () => {
        await expect(async () => {
          await action(
            await mockActionArgs({
              route: "/ekona/callback",
              formData: {
                SAMLResponse: "<xml>This is just a mock placeholder</xml>",
              },
              context: {},
              userEmail: "existing_user@foo.com",
              allData: {},
              explicitCookie: await commitEkonaSession(ekonaSession),
            })
          );
        }).rejects.toThrow();
        expect(spyOnRevokeFsc).not.toHaveBeenCalled();
      });
      spyOnRevokeFsc.mockClear();
    });
  });
});
