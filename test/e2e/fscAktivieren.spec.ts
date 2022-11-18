/// <reference types="../../cypress/support" />

const validFreischaltCode = "ABCD-1234-EFGH";

describe("/eingeben", () => {
  function createFscRequest(createdAt?: Date) {
    cy.task("addFscRequestId", {
      email: "foo@bar.com",
      fscRequestId: "foo",
      createdAt,
    });
  }

  beforeEach(() => {
    cy.request("GET", Cypress.env("ERICA_URL") + "/reset");
    cy.task("dbRemoveFsc", "foo@bar.com");
    cy.task("dbRemoveAllEricaRequestIds", "foo@bar.com");
    cy.task("setUserUnidentified", {
      email: "foo@bar.com",
    });
    cy.login();
  });

  afterEach(() => {
    cy.request("GET", Cypress.env("ERICA_URL") + "/reset");
    cy.task("dbRemoveFsc", "foo@bar.com");
    cy.task("dbRemoveAllEricaRequestIds", "foo@bar.com");
    cy.task("setUserUnidentified", {
      email: "foo@bar.com",
    });
  });

  describe("erica interactions", () => {
    beforeEach(() => {
      createFscRequest();
    });

    it("should redirect to success page if mockErica returns success", () => {
      cy.request("GET", Cypress.env("ERICA_URL") + "/triggerDirectResponse");
      cy.request("GET", Cypress.env("ERICA_URL") + "/triggerSuccess");
      cy.visit("/fsc/eingeben");
      cy.get("[name=freischaltCode]").type(validFreischaltCode);
      cy.get("form[action='/fsc/eingeben?index'] button").click();
      cy.url().should("include", "/fsc/eingeben/erfolgreich");
      cy.contains("Zur Übersicht").click();
      cy.url().should("include", "/formular/zusammenfassung");
    });

    it("should show spinner if data is correct and mockErica returns no result", () => {
      cy.request("GET", Cypress.env("ERICA_URL") + "/triggerDelayedResponse");
      cy.visit("/fsc/eingeben");
      cy.get("[name=freischaltCode]").type(validFreischaltCode);
      cy.get("form[action='/fsc/eingeben?index'] button").click();
      cy.contains("Ihr Freischaltcode wird überprüft.");
    });

    it("should show error messages and no spinner if user input is invalid", () => {
      cy.request("GET", Cypress.env("ERICA_URL") + "/triggerDelayedResponse");
      cy.visit("/fsc/eingeben");
      cy.get("[name=freischaltCode]").type("invalid");
      cy.get("form[action='/fsc/eingeben?index'] button").click();
      cy.contains("Ihre Eingabe war nicht richtig");
      cy.contains("Ihr Freischaltcode wird überprüft.").should("not.exist");
    });

    it("should show spinner if ericaRequestId already in database", () => {
      // We need to have an ongoing request at erica
      cy.request("GET", Cypress.env("ERICA_URL") + "/triggerNoResponse");
      cy.request("POST", Cypress.env("ERICA_URL") + "/v2/fsc/activation");
      cy.task("addEricaRequestIdFscAktivieren", {
        email: "foo@bar.com",
        ericaRequestId: "foo",
      });
      cy.visit("/fsc/eingeben");
      cy.contains("Ihr Freischaltcode wird überprüft.");
    });

    it("should show error message and no spinner if mockErica returns failure", () => {
      cy.request("GET", Cypress.env("ERICA_URL") + "/triggerDirectResponse");
      cy.request("GET", Cypress.env("ERICA_URL") + "/triggerFailure");
      cy.visit("/fsc/eingeben");
      cy.get("[name=freischaltCode]").type(validFreischaltCode);
      cy.get("form[action='/fsc/eingeben?index'] button").click();
      cy.contains(
        "Der eingegebene Freischaltcode ist nicht gültig. Sie haben insgesamt 5 Versuche. Danach müssen Sie einen neuen Freischaltcode beantragen."
      );
      cy.contains("Ihr Freischaltcode wird überprüft.").should("not.exist");
    });

    it("should redirect to success page if it was already successful", () => {
      cy.task("setUserIdentified", {
        email: "foo@bar.com",
      });
      cy.visit("/fsc/eingeben");
      cy.url().should("include", "/fsc/eingeben/erfolgreich");
    });

    it("should show spinner and revoke fsc if ericaAktivierenRequestId was deleted during process", () => {
      cy.request("GET", Cypress.env("ERICA_URL") + "/triggerNoResponse");
      cy.visit("/fsc/eingeben");
      cy.get("[name=freischaltCode]").type(validFreischaltCode);
      cy.get("form[action='/fsc/eingeben?index'] button").click();
      cy.contains("Ihr Freischaltcode wird überprüft.");

      //Simulate another task processing the erica request faster
      cy.task("dbRemoveAllEricaRequestIds", "foo@bar.com");
      cy.task("setIdentified", { email: "foo@bar.com", identified: true });
      cy.contains("Ihr Freischaltcode wird überprüft.");

      cy.request("GET", Cypress.env("ERICA_URL") + "/triggerDirectResponse");

      cy.url().should("include", "/fsc/eingeben/erfolgreich");
      cy.contains("Sie haben sich erfolgreich identifiziert.");

      cy.task("getFscRequest", "foo@bar.com").then((fscRequest) => {
        expect(fscRequest[0]).to.be.undefined;
      });
    });

    it("should show 500 page if failure and unexpected error", () => {
      //Because we do not reload the page we need to intercept the call in the background
      cy.intercept(
        "GET",
        "/fsc/eingeben?index=&_data=routes%2Ffsc%2Feingeben%2Findex"
      ).as("eingeben");
      cy.request("GET", Cypress.env("ERICA_URL") + "/triggerDirectResponse");
      cy.request("GET", Cypress.env("ERICA_URL") + "/triggerFailure");
      cy.request("GET", Cypress.env("ERICA_URL") + "/triggerUnexpectedFailure");
      cy.visit("/fsc/eingeben");
      cy.get("[name=freischaltCode]").type(validFreischaltCode);
      cy.get("form[action='/fsc/eingeben?index'] button").click();
      cy.wait("@eingeben").then((intercept) => {
        expect(intercept.response?.statusCode).equal(500);
      });
      cy.contains("Ein unerwarteter Fehler ist aufgetreten.");
    });
  });

  describe("rendered page", () => {
    it("should display remainig days on valid request", () => {
      createFscRequest(new Date());
      cy.visit("/fsc/eingeben");

      cy.get("[data-testid=hint-box]").should(
        "contain",
        `Ihr Freischaltcode wurde am ${new Date().toLocaleDateString(
          "de-DE"
        )} beantragt. Ihr Code läuft in 90 Tagen ab.`
      );
    });

    it("should display correct grammar on last remainig day", () => {
      const date89DaysAgo = new Date(
        new Date().setDate(new Date().getDate() - 89)
      );
      createFscRequest(date89DaysAgo);
      cy.visit("/fsc/eingeben");

      cy.get("[data-testid=hint-box]").should(
        "contain",
        `Ihr Freischaltcode wurde am ${date89DaysAgo.toLocaleDateString(
          "de-DE"
        )} beantragt. Ihr Code läuft in 1 Tag ab.`
      );
    });

    it("should render alt page on expired request", () => {
      createFscRequest(new Date(new Date().setDate(new Date().getDate() - 90)));
      cy.visit("/fsc/eingeben");

      cy.contains("h1", "Ihr Freischaltcode ist leider abgelaufen.");
      cy.get("[data-testid=hint-box]").should(
        "contain",
        "Ihr Code hat nach 90 Tagen seine Gültigkeit verloren. Beantragen Sie bitte einen neuen Freischaltcode."
      );
    });
  });
});

export {};
