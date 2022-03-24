/// <reference types="cypress" />
// @ts-check
describe("/registrieren", () => {
  it("simple success path", () => {
    cy.visit("/registrieren");
    cy.get("[name=email]").type("user@example.com");
    cy.get("[name=emailRepeated]").type("user@example.com");
    cy.get("[name=password]").type("password");
    cy.get("[name=passwordRepeated]").type("password");
    cy.get("form button").click();
    cy.url().should("include", "/registrieren/erfolgreich");
  });

  it("invalid email address", () => {
    cy.visit("/registrieren");
    cy.get("[name=email]").type("invalid email address");
    cy.get("form button").click();
    cy.contains("Bitte überprüfen Sie die Schreibweise der E-Mail-Adresse.");
  });
});

export {};
