/// <reference types="../../cypress/support" />

const validSteuerId = "77 819 250 434";

describe("/beantragen", () => {
  before(() => {
    cy.task("setUserUnidentified", {
      email: "foo@bar.com",
    });
  });
  beforeEach(() => {
    cy.request("GET", Cypress.env("ERICA_URL") + "/reset");
    cy.task("dbRemoveFsc", "foo@bar.com");
    cy.task("dbRemoveAllEricaRequestIds", "foo@bar.com");
    cy.login();
  });

  afterEach(() => {
    cy.request("GET", Cypress.env("ERICA_URL") + "/reset");
    cy.task("dbRemoveFsc", "foo@bar.com");
    cy.task("dbRemoveAllEricaRequestIds", "foo@bar.com");
  });

  after(() => {
    cy.task("redisQuit");
  });

  it("should show spinner if data is correct and mockErica returns no result", () => {
    cy.request("GET", Cypress.env("ERICA_URL") + "/triggerDelayedResponse");
    cy.visit("/fsc/beantragen");
    cy.get("[name=steuerId]").type(validSteuerId);
    cy.get("[name=geburtsdatum]").type("01.08.1991");
    cy.get("form[action='/fsc/beantragen?index'] button").click();
    cy.contains("Ihr Freischaltcode wird beantragt.");
    cy.contains("Weiter zum Formular").click();
    cy.url().should("include", "/formular/welcome");
  });

  it("should show error messages and no spinner if user input is invalid", () => {
    cy.request("GET", Cypress.env("ERICA_URL") + "/triggerDelayedResponse");
    cy.visit("/fsc/beantragen");
    cy.get("[name=steuerId]").type("1");
    cy.get("[name=geburtsdatum]").type("10");
    cy.get("form[action='/fsc/beantragen?index'] button").click();
    cy.contains("Bitte geben Sie Ihr Geburtsdatum im Format TT.MM.JJJJ ein");
    cy.contains(
      "Die Steuer-Identifikationsnummer ist genau 11-stellig. Bitte überprüfen Sie Ihre Eingabe."
    );
    cy.contains("Ihr Freischaltcode wird beantragt.").should("not.exist");
  });

  it("should show spinner if ericaRequestId already in database", () => {
    // We need to have an ongoing request at erica
    cy.request("GET", Cypress.env("ERICA_URL") + "/triggerNoResponse");
    cy.request("POST", Cypress.env("ERICA_URL") + "/v2/fsc/request");
    cy.task("addEricaRequestIdFscAntrag", {
      email: "foo@bar.com",
      ericaRequestId: "foo",
    });
    cy.visit("/fsc/beantragen");
    cy.contains("Ihr Freischaltcode wird beantragt.");
  });

  it("should redirect to success page if mockErica returns success", () => {
    cy.request("GET", Cypress.env("ERICA_URL") + "/triggerDirectResponse");
    cy.request("GET", Cypress.env("ERICA_URL") + "/triggerSuccess");
    cy.visit("/fsc/beantragen");
    cy.get("[name=steuerId]").type(validSteuerId);
    cy.get("[name=geburtsdatum]").type("01.08.1991");
    cy.get("form[action='/fsc/beantragen?index'] button").click();
    cy.url().should("include", "/fsc/beantragen/erfolgreich");
  });

  it("should show error message and no spinner if mockErica returns failure", () => {
    cy.request("GET", Cypress.env("ERICA_URL") + "/triggerDirectResponse");
    cy.request("GET", Cypress.env("ERICA_URL") + "/triggerFailure");
    cy.visit("/fsc/beantragen");
    cy.get("[name=steuerId]").type(validSteuerId);
    cy.get("[name=geburtsdatum]").type("01.08.1991");
    cy.get("form[action='/fsc/beantragen?index'] button").click();
    cy.contains("Bitte überprüfen Sie Ihre Angaben.");
    cy.contains("Ihr Freischaltcode wird beantragt.").should("not.exist");
  });

  it("should redirect to success page if it was already successful", () => {
    cy.task("addFscRequestId", {
      email: "foo@bar.com",
      fscRequestId: "foo",
    });
    cy.visit("/fsc/beantragen");
    cy.url().should("include", "/fsc/beantragen/erfolgreich");
  });

  it("should show 500 page if failure and unexpected error", () => {
    //Because we do not reload the page we need to intercept the call in the background
    cy.intercept(
      "GET",
      "/fsc/beantragen?index=&_data=routes%2Ffsc%2Fbeantragen%2Findex"
    ).as("beantragen");
    cy.request("GET", Cypress.env("ERICA_URL") + "/triggerDirectResponse");
    cy.request("GET", Cypress.env("ERICA_URL") + "/triggerFailure");
    cy.request("GET", Cypress.env("ERICA_URL") + "/triggerUnexpectedFailure");
    cy.visit("/fsc/beantragen");
    cy.get("[name=steuerId]").type(validSteuerId);
    cy.get("[name=geburtsdatum]").type("01.08.1991");
    cy.get("form[action='/fsc/beantragen?index'] button").click();
    cy.wait("@beantragen").then((intercept) => {
      expect(intercept.response?.statusCode).equal(500);
    });
    cy.contains("Ein unerwarteter Fehler ist aufgetreten.");
  });
});

export {};
