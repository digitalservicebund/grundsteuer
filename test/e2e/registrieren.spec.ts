/// <reference types="cypress" />
// @ts-check
describe("/registrieren", () => {
  it("simple success path", () => {
    cy.visit("/registrieren");
    cy.get("[name=email]").type("user@example.com");
    cy.get("label[for=confirmDataPrivacy]").click("topLeft");
    cy.get("label[for=confirmTermsOfUse]").click("topLeft");
    cy.get("label[for=confirmEligibilityCheck]").click("topLeft");
    cy.get("form button").click();
    cy.url().should("include", "/registrieren/erfolgreich");
  });

  it("invalid email address", () => {
    cy.visit("/registrieren");
    cy.get("[name=email]").type("invalid email address");
    cy.get("form button").click();
    cy.contains("Bitte überprüfen Sie die Schreibweise der E-Mail-Adresse.");
  });

  it("should not fail for existing user", () => {
    const email = "foo@bar.com";
    cy.visit("/registrieren");
    cy.get("[name=email]").type(email);
    cy.get("label[for=confirmDataPrivacy]").click("topLeft");
    cy.get("label[for=confirmTermsOfUse]").click("topLeft");
    cy.get("label[for=confirmEligibilityCheck]").click("topLeft");
    cy.get("form button").click();
    cy.url().should("include", "/registrieren/erfolgreich");
  });

  it("should not fail for existing user with capitalized mail", () => {
    const email = "fOO@bAr.cOm";
    cy.visit("/registrieren");
    cy.get("[name=email]").type(email);
    cy.get("label[for=confirmDataPrivacy]").click("topLeft");
    cy.get("label[for=confirmTermsOfUse]").click("topLeft");
    cy.get("label[for=confirmEligibilityCheck]").click("topLeft");
    cy.get("form button").click();
    cy.url().should("include", "/registrieren/erfolgreich");
  });

  it("data privacy not confirmed", () => {
    cy.visit("/registrieren");
    cy.get("[name=email]").type("user@example.com");
    cy.get("label[for=confirmEligibilityCheck]").click("topLeft");
    cy.get("label[for=confirmTermsOfUse]").click("topLeft");
    cy.get("form button").click();
    cy.contains("Bitte füllen Sie dieses Feld aus.");
  });

  it("terms of use not confirmed", () => {
    cy.visit("/registrieren");
    cy.get("[name=email]").type("user@example.com");
    cy.get("label[for=confirmEligibilityCheck]").click("topLeft");
    cy.get("label[for=confirmDataPrivacy]").click("topLeft");
    cy.get("form button").click();
    cy.contains("Bitte füllen Sie dieses Feld aus.");
  });

  it("success of eligibility check not confirmed", () => {
    cy.visit("/registrieren");
    cy.get("[name=email]").type("user@example.com");
    cy.get("label[for=confirmDataPrivacy]").click("topLeft");
    cy.get("label[for=confirmTermsOfUse]").click("topLeft");
    cy.get("form button").click();
    cy.contains("Bitte füllen Sie dieses Feld aus.");
  });
});

export {};
