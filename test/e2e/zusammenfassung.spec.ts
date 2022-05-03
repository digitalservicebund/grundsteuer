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

  describe("edit behaviour", () => {
    beforeEach(() => {
      cy.visit("formular/grundstueck/adresse");
      cy.get("#ort").type("Berlin");
      cy.get("#bundesland").select("BE");
      cy.get("#nextButton").click();
      cy.url().should("not.include", "formular/grundstueck/adresse");
      cy.url().should("not.include", "formular/zusammenfassung");

      cy.visit("formular/zusammenfassung");
      cy.get("button").contains("Grundstück").click();
      cy.get("div[data-state=open]").should("exist");
      cy.get("dt").contains("Ort").parent().next().contains("Ändern").click();
    });

    it("should link to correct page", () => {
      cy.url().should("include", "formular/grundstueck/adresse");
    });

    it("should point back to zusammenfassung", () => {
      cy.get("#nextButton").click();
      cy.url().should("include", "formular/zusammenfassung");
    });

    it("should set correct text on next button", () => {
      cy.get("#nextButton").contains("Speichern & Zur Prüfseite");
    });

    it("should execute validations", () => {
      cy.get("#ort").clear();
      cy.get("#nextButton").click();
      cy.url().should("include", "formular/grundstueck/adresse");
    });
  });
});

export {};
