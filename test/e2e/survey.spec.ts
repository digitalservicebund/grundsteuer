/// <reference types="../../cypress/support" />

describe("Survey feedback", () => {
  describe("when user is successfully identified", () => {
    beforeEach(() => {
      cy.task("setUserIdentified", {
        email: "foo@bar.com",
      });
      cy.login();
    });

    it("should show survey page once on the BundesIdent success identification page", () => {
      cy.visit("/bundesIdent/erfolgreich");
      cy.contains("div", "Weiter zum Formular").click();
      cy.url().should("include", "/bundesIdent/survey/success");

      cy.visit("/bundesIdent/erfolgreich");
      cy.contains("div", "Weiter zum Formular").click();
      cy.url().should("include", "/formular/welcome");
    });

    it("should redirect user to formular page after submitting the survey", () => {
      cy.visit("/bundesIdent/erfolgreich");
      cy.contains("div", "Weiter zum Formular").click();
      cy.url().should("include", "/bundesIdent/survey/success");
      cy.get('[data-testid="survey-success-textarea"]').type("nice feedback");
      cy.contains("button", "Übernehmen & weiter").click();
      cy.url().should("include", "/formular/welcome");
    });

    it("should show survey page once on the generic success identification page", () => {
      cy.visit("/identifikation/erfolgreich");
      cy.contains("div", "Weiter zum Formular").click();
      cy.url().should("include", "/bundesIdent/survey/success");

      cy.visit("/identifikation/erfolgreich");
      cy.contains("div", "Weiter zum Formular").click();
      cy.url().should("include", "/formular/welcome");
    });
  });

  describe("when user is not identified", () => {
    beforeEach(() => {
      cy.task("setUserUnidentified", {
        email: "foo@bar.com",
      });
      cy.login();
    });

    it("should show survey page once when users goes back to the identification options page", () => {
      // when first visit
      cy.visit("/identifikation");
      cy.contains("h1", "Mit welcher Option möchten Sie sich identifizieren?");
      cy.contains("div", "Identifikation mit Ausweis").click();

      cy.url().should("include", "/bundesIdent/desktop");
      cy.contains(
        "h1",
        "Schnell und sicher mit der BundesIdent App auf Ihrem Smartphone identifizieren"
      );
      cy.contains("div", "Zurück zu Identifikationsoptionen").click();

      // then show survey
      cy.url().should("include", "/bundesIdent/survey/dropout");
      cy.contains(
        "h1",
        "Warum haben Sie sich gegen eine Identifikation mit dem Ausweis entschieden?"
      );
      cy.contains("a", "Überspringen").click();

      cy.url().should("include", "/identifikation");
      cy.contains("h1", "Mit welcher Option möchten Sie sich identifizieren?");

      // when second visit
      cy.contains("div", "Identifikation mit Ausweis").click();

      cy.url().should("include", "/bundesIdent/desktop");
      cy.contains(
        "h1",
        "Schnell und sicher mit der BundesIdent App auf Ihrem Smartphone identifizieren"
      );
      cy.contains("div", "Zurück zu Identifikationsoptionen").click();

      // then no survey
      cy.url().should("include", "/identifikation");
      cy.contains("h1", "Mit welcher Option möchten Sie sich identifizieren?");
    });

    it("should redirect user to identification option page after submitting the survey", () => {
      cy.visit("/identifikation");
      cy.contains("div", "Identifikation mit Ausweis").click();
      cy.contains("div", "Zurück zu Identifikationsoptionen").click();
      cy.url().should("include", "/bundesIdent/survey/dropout");
      cy.get('[data-testid="survey-dropout-textarea"]').type(
        "dropout feedback"
      );
      cy.contains("button", "Übernehmen & weiter").click();
      cy.url().should("include", "/identifikation");
    });
  });
});
