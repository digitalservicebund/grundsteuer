/// <reference types="../../cypress/support" />
// @ts-check
describe("Zusammenfassung route", () => {
  before(() => {
    cy.task("setUserIdentified", {
      userEmail: "foo@bar.com",
    });
  });
  after(() => {
    cy.task("setUserUnidentified", {
      userEmail: "foo@bar.com",
    });
  });
  beforeEach(() => {
    cy.login();
  });

  describe("identified user", () => {
    before(() => {
      cy.task("setUserIdentified", {
        userEmail: "foo@bar.com",
      });
    });

    it("should show previous form errors with no data set", () => {
      cy.visit("/formular/zusammenfassung");
      cy.get("label[for=confirmCompleteCorrect]").click("left");
      cy.get("label[for=confirmDataPrivacy]").click("left");
      cy.get("label[for=confirmTermsOfUse]").click("left");
      cy.get("#nextButton").click();

      cy.url().should("include", "/formular/zusammenfassung");
      cy.contains("Es sind Fehler im Formular aufgetreten.").should("exist");
    });
  });

  describe("freischaltcode", () => {
    beforeEach(() => {
      cy.visit("/formular/zusammenfassung");
    });

    describe("not yet identified user", () => {
      before(() => {
        cy.task("setUserUnidentified", {
          userEmail: "foo@bar.com",
        });
      });
      it("should contain fsc section", () => {
        cy.contains("Sie haben sich noch nicht identifiziert.");
      });

      it("should contain link and go to /identifikation page on click", () => {
        cy.contains("a", "Zum Bereich Identifikation").click();
        cy.url().should("include", "/identifikation");
      });

      it("should have a disabled submit button", () => {
        cy.get("form[action='/formular/zusammenfassung'] button").should(
          "be.disabled"
        );
      });
    });

    describe("identified user", () => {
      before(() => {
        cy.task("setUserIdentified", {
          userEmail: "foo@bar.com",
        });
      });
      it("should not contain fsc section", () => {
        cy.contains("Bitte geben Sie den Freischaltcode ein").should(
          "not.exist"
        );
      });

      it("should have an enabled submit button", () => {
        cy.get("form[action='/formular/zusammenfassung'] button").should(
          "not.be.disabled"
        );
      });
    });
  });

  describe("edit behaviour", () => {
    beforeEach(() => {
      cy.visit("/formular/grundstueck/adresse");
      cy.get("#ort").type("Berlin");
      cy.get("#bundesland").select("BE");
      cy.get("#nextButton").click();
      cy.url().should("not.include", "/formular/grundstueck/adresse");
      cy.url().should("not.include", "/formular/zusammenfassung");

      cy.visit("/formular/zusammenfassung");
      cy.contains("summary", "Grundstück").click();
      cy.get('a[href="/formular/grundstueck/adresse?redirectToSummary=true"]')
        .first()
        .click();
    });

    it("should point back to zusammenfassung", () => {
      cy.get("#nextButton").click();
      cy.url().should("include", "/formular/zusammenfassung");
    });

    it("should set correct text on next button", () => {
      cy.contains("#nextButton", "Übernehmen & Zur Übersicht");
    });

    it("should execute validations", () => {
      cy.get("#ort").clear();
      cy.get("#nextButton").click();
      cy.url().should("include", "/formular/grundstueck/adresse");
    });
  });
});

export {};
