/// <reference types="../../cypress/support" />
// @ts-check
describe("Logout", () => {
  it("should redirect to /abmelden/erfolgreich", () => {
    cy.login();
    cy.visit("/formular/welcome");
    cy.url().should("include", "/formular/welcome");
    cy.get("[data-testid=logout-button]").first().click({ force: true });
    cy.url().should("include", "/abmelden/erfolgreich");
  });

  it("should redirect to /anmelden when trying to access formular being logged out", () => {
    cy.login();
    cy.visit("/formular/welcome");
    cy.url().should("include", "/formular/welcome");
    cy.get("[data-testid=logout-button]").first().click({ force: true });
    cy.url().should("include", "/abmelden/erfolgreich");
    cy.visit("/formular/welcome");
    cy.url().should("include", "/anmelden");
  });
});

export {};
