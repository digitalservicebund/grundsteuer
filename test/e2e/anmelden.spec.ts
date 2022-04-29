/// <reference types="cypress" />
// @ts-check
describe("/anmelden", () => {
  it("simple success path", () => {
    cy.visit("/anmelden");
    cy.get("[name=email]").type("foo@bar.com");
    cy.get("[name=password]").type("12345678");
    cy.get("form button").click();
    cy.url().should("include", "/fsc/beantragen");
  });

  it("should fail on wrong username", () => {
    cy.visit("/anmelden");
    cy.get("[name=email]").type("bar@bar.com");
    cy.get("[name=password]").type("12345678");
    cy.get("form button").click();
    cy.contains("E-Mail-Adresse und/oder Passwort falsch.");
  });

  it("should fail on wrong password", () => {
    cy.visit("/anmelden");
    cy.get("[name=email]").type("foo@bar.com");
    cy.get("[name=password]").type("123456789");
    cy.get("form button").click();
    cy.contains("E-Mail-Adresse und/oder Passwort falsch.");
  });
});

export {};
