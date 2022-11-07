/// <reference types="../../cypress/support" />

describe("/fsc/stornieren", () => {
  beforeEach(() => {
    cy.request("GET", Cypress.env("ERICA_URL") + "/reset");
    cy.task("dbResetUser", "foo@bar.com");
    cy.login();
  });

  afterEach(() => {
    cy.request("GET", Cypress.env("ERICA_URL") + "/reset");
    cy.task("dbRemoveFsc", "foo@bar.com");
    cy.task("dbResetUser", "foo@bar.com");
  });

  it("revocation not yet started > start it > spinner", () => {
    cy.task("addFscRequestId", {
      email: "foo@bar.com",
      fscRequestId: "fooRequestId",
    });
    cy.visit("/fsc/stornieren");
    cy.get("form[action='/fsc/stornieren?index'] button").click();
    cy.contains("Ihr Freischaltcode wird storniert.");
  });

  it("revocation already started > spinner", () => {
    cy.task("addFscRequestId", {
      email: "foo@bar.com",
      fscRequestId: "fooRequestId",
    });
    cy.task("addEricaRequestIdFscStornieren", {
      email: "foo@bar.com",
      ericaRequestId: "foo",
    });
    cy.visit("/fsc/stornieren");
    cy.contains("Ihr Freischaltcode wird storniert.");
  });

  it("revocation done > redirect to success page", () => {
    // user has no (longer) a fsc request
    cy.visit("/fsc/stornieren");
    cy.url().should("include", "/fsc/stornieren/erfolgreich");
  });

  it("start revocation > spinner > fsc request revoked > redirect to success page", () => {
    cy.task("addFscRequestId", {
      email: "foo@bar.com",
      fscRequestId: "fooRequestId",
    });
    cy.visit("/fsc/stornieren");
    cy.get("form[action='/fsc/stornieren?index'] button").click();
    cy.contains("Ihr Freischaltcode wird storniert.");
    // simulate cron job (success = fsc request gets deleted)
    cy.task("dbRemoveFsc", "foo@bar.com");
    cy.url().should("include", "/fsc/stornieren/erfolgreich");
  });
});

export {};
