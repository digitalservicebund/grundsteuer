/// <reference types="../../cypress/support" />
// @ts-check
describe("Zusammenfassung route", () => {
  beforeEach(() => {
    cy.login();
  });

  it("should display the title", () => {
    cy.visit("/formular/zusammenfassung");
    cy.get("h1").contains("Bitte prüfen Sie Ihre Angaben");
  });

  it("should return errors with unfilled fields", () => {
    cy.visit("/formular/zusammenfassung");
    cy.get("#nextButton").click();

    cy.url().should("include", "/formular/zusammenfassung");
    cy.get("#confirmCompleteCorrect")
      .parent()
      .contains("Bitte füllen Sie dieses Feld aus.");
    cy.get("#confirmDataPrivacy")
      .parent()
      .contains("Bitte füllen Sie dieses Feld aus.");
    cy.get("#confirmTermsOfUse")
      .parent()
      .contains("Bitte füllen Sie dieses Feld aus.");
  });

  it("should not return errors with filled fields", () => {
    cy.visit("/formular/zusammenfassung");
    cy.get("label[for=confirmCompleteCorrect]").click();
    cy.get("label[for=confirmDataPrivacy]").click();
    cy.get("label[for=confirmTermsOfUse]").click();
    cy.get("#nextButton").click();

    cy.url().should("include", "/formular/zusammenfassung");
    cy.contains("Bitte füllen Sie dieses Feld aus.").should("not.exist");
  });

  // TODO check FSC display/hide behaviour
});

export {};
