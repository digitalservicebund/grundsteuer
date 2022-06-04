/// <reference types="cypress" />
// @ts-check
describe("/anmelden", () => {
  before(() => {
    cy.task("dbResetUser", "foo@bar.com");
  });

  it("simple success path", () => {
    cy.visit("/anmelden");
    cy.get("[name=email]").type("foo@bar.com");
    cy.get("form button").click();
    cy.url().should("include", "/anmelden/email");
  });

  it("should succeed with not lowercase mail", () => {
    cy.visit("/anmelden");
    cy.get("[name=email]").type("fOO@bAr.coM");
    cy.get("form button").click();
    cy.url().should("include", "/anmelden/email");
  });

  it("should not fail on wrong username", () => {
    cy.visit("/anmelden");
    cy.get("[name=email]").type("bar@bar.com");
    cy.get("form button").click();
    cy.url().should("include", "/anmelden/email");
  });
});

export {};
