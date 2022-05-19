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

  it("password too short", () => {
    const email = "bar@bar.com";
    const password = "7654321";
    cy.visit("/registrieren");
    cy.get("[name=email]").type(email);
    cy.get("[name=emailRepeated]").type(email);
    cy.get("[name=password]").type(password);
    cy.get("[name=passwordRepeated]").type(password);
    cy.get("form button").click();
    cy.contains("Passwort ist zu kurz");
  });

  it("should fail for existing user", () => {
    const email = "foo@bar.com";
    const password = "87654321";
    cy.visit("/registrieren");
    cy.get("[name=email]").type(email);
    cy.get("[name=emailRepeated]").type(email);
    cy.get("[name=password]").type(password);
    cy.get("[name=passwordRepeated]").type(password);
    cy.get("form button").click();
    cy.contains("Es existiert bereits");
  });

  it("should fail for existing user with capitalized mail", () => {
    const email = "fOO@bAr.cOm";
    const password = "87654321";
    cy.visit("/registrieren");
    cy.get("[name=email]").type(email);
    cy.get("[name=emailRepeated]").type(email);
    cy.get("[name=password]").type(password);
    cy.get("[name=passwordRepeated]").type(password);
    cy.get("form button").click();
    cy.contains("Es existiert bereits");
  });

  it("incorrectly repeated email", () => {
    const email = "bar@bar.com";
    const password = "87654321";
    cy.visit("/registrieren");
    cy.get("[name=email]").type(email);
    cy.get("[name=emailRepeated]").type("bar@foo.com");
    cy.get("[name=password]").type(password);
    cy.get("[name=passwordRepeated]").type(password);
    cy.get("form button").click();
    cy.contains("E-Mail-Adresse genau so ein");
  });

  it("incorrectly repeated password", () => {
    const email = "bar@bar.com";
    const password = "87654321";
    cy.visit("/registrieren");
    cy.get("[name=email]").type(email);
    cy.get("[name=emailRepeated]").type(email);
    cy.get("[name=password]").type(password);
    cy.get("[name=passwordRepeated]").type("12345678");
    cy.get("form button").click();
    cy.contains("stimmen nicht");
  });
});

export {};
