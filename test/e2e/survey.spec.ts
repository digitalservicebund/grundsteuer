/// <reference types="../../cypress/support" />
const mobileUserAgent =
  "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Mobile Safari/537.36";

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

    describe("and in desktop", () => {
      it("should show survey page once when users goes back to the identification options page", () => {
        // when first visit
        cy.visit("/identifikation");
        cy.contains(
          "h1",
          "Mit welcher Option möchten Sie sich identifizieren?"
        );
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
        cy.contains(
          "h1",
          "Mit welcher Option möchten Sie sich identifizieren?"
        );

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
        cy.contains(
          "h1",
          "Mit welcher Option möchten Sie sich identifizieren?"
        );
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

    describe("and in mobile", () => {
      it("should show survey page once when users goes back to the identification options page", () => {
        // first visit
        cy.visit("/identifikation", {
          headers: {
            "user-agent": mobileUserAgent,
          },
        });
        cy.contains(
          "h1",
          "Mit welcher Option möchten Sie sich identifizieren?"
        );

        // THEN I click on the Identifikation mit Ausweis
        cy.contains("div", "Identifikation mit Ausweis").click();

        // THEN I should be on the Voraussetzung page
        cy.url().should("include", "/bundesIdent/voraussetzung");
        cy.contains(
          "h1",
          "Voraussetzung für die Identifikation mit Ihrem Ausweis"
        );

        // WHEN I click back to the identification option
        cy.contains("a", "Zurück zu Identifikationsoptionen").click();

        // THEN I should see dropout survey
        cy.url().should("include", "/bundesIdent/survey/dropout");
        cy.contains(
          "h1",
          "Warum haben Sie sich gegen eine Identifikation mit dem Ausweis entschieden?"
        );

        // WHEN I click skip button
        cy.contains("a", "Überspringen").click();

        // THEN I should be on the identification option page
        cy.url().should("include", "/identifikation");
        cy.contains(
          "h1",
          "Mit welcher Option möchten Sie sich identifizieren?"
        );

        // WHEN I click on the Identifikation mit Ausweis button again
        cy.contains("div", "Identifikation mit Ausweis").click();

        // WHEN I click back button
        cy.contains("div", "Zurück zu Identifikationsoptionen").click();

        // THEN I should NOT see dropout survey
        cy.url().should("include", "/identifikation");
        cy.contains(
          "h1",
          "Mit welcher Option möchten Sie sich identifizieren?"
        );
      });

      it("should redirect user to identification option page after submitting the survey", () => {
        cy.visit("/identifikation", {
          headers: {
            "user-agent": mobileUserAgent,
          },
        });
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
});
