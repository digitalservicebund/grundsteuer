/// <reference types="../../cypress/support" />
// @ts-check
describe("Zusammenfassung route", () => {
  before(() => {
    cy.task("setUserIdentifiedAttribute", {
      userEmail: "foo@bar.com",
      identified: true,
    });
  });
  after(() => {
    cy.task("setUserIdentifiedAttribute", {
      userEmail: "foo@bar.com",
      identified: false,
    });
  });
  beforeEach(() => {
    cy.login();
  });

  it("should display the title", () => {
    cy.visit("/formular/zusammenfassung");
    cy.get("h1").contains("Bitte überprüfen Sie Ihre Angaben vor dem Versand");
  });

  describe("identified user", () => {
    before(() => {
      cy.task("setUserIdentifiedAttribute", {
        userEmail: "foo@bar.com",
        identified: true,
      });
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
      cy.get("label[for=confirmCompleteCorrect]").click("left");
      cy.get("label[for=confirmDataPrivacy]").click("left");
      cy.get("label[for=confirmTermsOfUse]").click("left");
      cy.get("#nextButton").click();

      cy.url().should("include", "/formular/zusammenfassung");
      cy.contains("Bitte füllen Sie dieses Feld aus.").should("not.exist");
    });

    it("should show previous form errors with no data set", () => {
      cy.visit("/formular/zusammenfassung");
      cy.get("label[for=confirmCompleteCorrect]").click("left");
      cy.get("label[for=confirmDataPrivacy]").click("left");
      cy.get("label[for=confirmTermsOfUse]").click("left");
      cy.get("#nextButton").click();

      cy.url().should("include", "/formular/zusammenfassung");
      cy.contains(
        "Es sind Fehler im Formular aufgetreten, bitte überprüfen Sie Ihre Angaben."
      ).should("exist");
    });
  });

  describe("freischaltcode", () => {
    beforeEach(() => {
      cy.visit("/formular/zusammenfassung");
    });

    describe("not yet identified user", () => {
      before(() => {
        cy.task("setUserIdentifiedAttribute", {
          userEmail: "foo@bar.com",
          identified: false,
        });
      });
      it("should contain fsc section", () => {
        cy.contains("Sie haben noch keinen Freischaltcode eingegeben.");
      });

      it("should contain link and go to /fsc page on click", () => {
        cy.get("a").contains("Zum Bereich Freischaltcode").click();
        cy.url().should("include", "/fsc");
      });

      it("should have a disabled submit button", () => {
        cy.get("form[action='/formular/zusammenfassung'] button").should(
          "be.disabled"
        );
      });
    });

    describe("identified user", () => {
      before(() => {
        cy.task("setUserIdentifiedAttribute", {
          userEmail: "foo@bar.com",
          identified: true,
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
      cy.visit("formular/grundstueck/adresse");
      cy.get("#ort").type("Berlin");
      cy.get("#bundesland").select("BE");
      cy.get("#nextButton").click();
      cy.url().should("not.include", "formular/grundstueck/adresse");
      cy.url().should("not.include", "formular/zusammenfassung");

      cy.visit("formular/zusammenfassung");
      cy.get("button").contains("Grundstück").wait(100).click();
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
      cy.get("#nextButton").contains("Übernehmen & Zur Prüfseite");
    });

    it("should execute validations", () => {
      cy.get("#ort").clear();
      cy.get("#nextButton").click();
      cy.url().should("include", "formular/grundstueck/adresse");
    });
  });
});

export {};
