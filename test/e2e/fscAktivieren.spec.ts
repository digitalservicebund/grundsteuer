/// <reference types="../../cypress/support" />

const validFreischaltCode = "ABCD-1234-EFGH";

describe("/eingeben", () => {
  beforeEach(() => {
    cy.request("GET", "http://localhost:8000/reset");
    cy.task("dbRemoveFsc", "foo@bar.com");
    cy.task("dbRemoveAllEricaRequestIds", "foo@bar.com");
    cy.task("setUserIdentifiedAttribute", {
      userEmail: "foo@bar.com",
      identified: false,
    });
    cy.task("addFscRequestId", {
      userEmail: "foo@bar.com",
      fscRequestId: "foo",
    });
    cy.login();
  });

  afterEach(() => {
    cy.request("GET", "http://localhost:8000/reset");
    cy.task("dbRemoveFsc", "foo@bar.com");
    cy.task("dbRemoveAllEricaRequestIds", "foo@bar.com");
    cy.task("setUserIdentifiedAttribute", {
      userEmail: "foo@bar.com",
      identified: false,
    });
  });

  it("should redirect to success page if mockErica returns success", () => {
    cy.request("GET", "http://localhost:8000/triggerDirectResponse");
    cy.request("GET", "http://localhost:8000/triggerSuccess");
    cy.visit("/fsc/eingeben");
    cy.get("[name=freischaltCode]").type(validFreischaltCode);
    cy.get("form[action='/fsc/eingeben?index'] button").click();
    cy.url().should("include", "/fsc/eingeben/erfolgreich");
  });

  it("should show spinner if data is correct and mockErica returns no result", () => {
    cy.request("GET", "http://localhost:8000/triggerDelayedResponse");
    cy.visit("/fsc/eingeben");
    cy.get("[name=freischaltCode]").type(validFreischaltCode);
    cy.get("form[action='/fsc/eingeben?index'] button").click();
    cy.contains("Ihr Freischaltcode wird überprüft.");
  });

  it("should show error messages and no spinner if user input is invalid", () => {
    cy.request("GET", "http://localhost:8000/triggerDelayedResponse");
    cy.visit("/fsc/eingeben");
    cy.get("[name=freischaltCode]").type("invalid");
    cy.get("form[action='/fsc/eingeben?index'] button").click();
    cy.contains("Ihre Eingabe war nicht richtig");
    cy.contains("Ihr Freischaltcode wird überprüft.").should("not.exist");
  });

  it("should show spinner if ericaRequestId already in database", () => {
    cy.task("addEricaRequestIdFscAktivieren", {
      userEmail: "foo@bar.com",
      ericaRequestId: "foo",
    });
    cy.visit("/fsc/eingeben");
    cy.contains("Ihr Freischaltcode wird überprüft.");
  });

  it("should show error message and no spinner if mockErica returns failure", () => {
    cy.request("GET", "http://localhost:8000/triggerDirectResponse");
    cy.request("GET", "http://localhost:8000/triggerFailure");
    cy.visit("/fsc/eingeben");
    cy.get("[name=freischaltCode]").type(validFreischaltCode);
    cy.get("form[action='/fsc/eingeben?index'] button").click();
    cy.contains(
      "Der eingegebene Freischaltcode ist nicht gültig. Sie haben insgesamt 5 Versuche. Danach müssen Sie einen neuen Freischaltcode beantragen."
    );
    cy.contains("Ihr Freischaltcode wird überprüft.").should("not.exist");
  });

  it("should redirect to success page if it was already successful", () => {
    cy.task("setUserIdentifiedAttribute", {
      userEmail: "foo@bar.com",
      identified: true,
    });
    cy.visit("/fsc/eingeben");
    cy.url().should("include", "/fsc/eingeben/erfolgreich");
  });

  it("should show 500 page if failure and unexpected error", () => {
    //Because we do not reload the page we need to intercept the call in the background
    cy.intercept(
      "GET",
      "/fsc/eingeben?index=&_data=routes%2Ffsc%2Feingeben%2Findex"
    ).as("eingeben");
    cy.request("GET", "http://localhost:8000/triggerDirectResponse");
    cy.request("GET", "http://localhost:8000/triggerFailure");
    cy.request("GET", "http://localhost:8000/triggerUnexpectedFailure");
    cy.visit("/fsc/eingeben");
    cy.get("[name=freischaltCode]").type(validFreischaltCode);
    cy.get("form[action='/fsc/eingeben?index'] button").click();
    cy.wait("@eingeben").then((intercept) => {
      expect(intercept.response?.statusCode).equal(500);
    });
    cy.contains("Ein unerwarteter Fehler ist aufgetreten.");
  });
});

export {};
