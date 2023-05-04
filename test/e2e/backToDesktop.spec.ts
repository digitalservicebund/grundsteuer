/// <reference types="../../cypress/support" />
const mobileUserAgent =
  "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Mobile Safari/537.36";

describe("Back to Desktop", () => {
  describe("when user is successfully identified", () => {
    beforeEach(() => {
      cy.task("setUserIdentified", {
        email: "foo@bar.com",
      });
      cy.login();
    });

    it("should show survey page once", () => {
      cy.visit("/bundesIdent/erfolgreich", {
        headers: {
          "user-agent": mobileUserAgent,
        },
      });
      cy.contains("div", "Weiter").click();
      cy.url().should("include", "/bundesIdent/survey/success");
    });

    describe("when user answers that they start from desktop or tablet", () => {
      it("should redirect user to formular page", () => {
        cy.visit("/bundesIdent/erfolgreich", {
          headers: {
            "user-agent": mobileUserAgent,
          },
        });
        cy.contains("div", "Weiter").click();
        cy.url().should("include", "/bundesIdent/survey/success");
        cy.contains("div", "Übernehmen & weiter").click();
        cy.contains(
          "h1",
          "Haben Sie die Grundsteuererklärung auf dem Computer bzw. Tablet angefangen?"
        );
        cy.get(`label[for=startAnswer-startDesktop]`).click();
        cy.contains("div", "Übernehmen & weiter").click();
        cy.url().should("include", "/bundesIdent/backtodesktop");
        cy.contains(
          "h1",
          "Klicken Sie am Computer bzw. Tablet auf »Weiter«, um fortzufahren"
        );
        cy.contains("div", "Zurück").click();
        cy.url().should("include", "/bundesIdent/device");
      });
    });

    describe("when user answers that they start from mobile", () => {
      it("should redirect user to formular page", () => {
        cy.visit("/bundesIdent/erfolgreich", {
          headers: {
            "user-agent": mobileUserAgent,
          },
        });
        cy.contains("div", "Weiter").click();
        cy.url().should("include", "/bundesIdent/survey/success");
        cy.contains("div", "Übernehmen & weiter").click();
        cy.contains(
          "h1",
          "Haben Sie die Grundsteuererklärung auf dem Computer bzw. Tablet angefangen?"
        );
        cy.get(`label[for=startAnswer-startMobile]`).click();
        cy.contains("div", "Übernehmen & weiter").click();
        cy.url().should("include", "/formular");
      });
    });

    describe("when user does not answers", () => {
      it("should show error", () => {
        cy.visit("/bundesIdent/erfolgreich", {
          headers: {
            "user-agent": mobileUserAgent,
          },
        });
        cy.contains("div", "Weiter").click();
        cy.url().should("include", "/bundesIdent/survey/success");
        cy.contains("div", "Übernehmen & weiter").click();
        cy.contains(
          "h1",
          "Haben Sie die Grundsteuererklärung auf dem Computer bzw. Tablet angefangen?"
        );
        cy.contains("div", "Übernehmen & weiter").click();
        cy.contains("div", "Es ist ein Fehler aufgetreten.");
        cy.contains("div", "Bitte treffen Sie eine Auswahl");
      });
    });
  });
});
