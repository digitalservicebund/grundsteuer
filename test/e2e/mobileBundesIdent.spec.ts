/// <reference types="../../cypress/support" />
const androidMobileDevice =
  "Mozilla/5.0 (Linux; Android 12; Pixel 7 XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.5563.57 Mobile Safari/537.36";
const iOSMobileDevice =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1";

describe("Rating Flow", () => {
  beforeEach(() => {
    cy.task("setUserIdentified", {
      email: "foo@bar.com",
    });
    cy.login();
  });

  describe("when first time visit after identification", () => {
    describe("with an answer 'Kompliziert' or 'Ok' ", () => {
      it("should show success page", () => {
        cy.visit("/bundesIdent/erfolgreich", {
          headers: {
            "user-agent": androidMobileDevice,
          },
        });
        cy.contains("div", "Weiter").click();
        cy.url().should("include", "/formular/welcome");
      });
    });
    describe("with an answer 'Super'", () => {
      it("should show success page", () => {
        cy.visit("/bundesIdent/erfolgreich", {
          headers: {
            "user-agent": androidMobileDevice,
          },
        });
        cy.contains("div", "Weiter").click();
        cy.url().should("include", "/formular/welcome");
      });
    });
    describe("with no answer", () => {
      it("should error notification", () => {
        cy.visit("/bundesIdent/erfolgreich", {
          headers: {
            "user-agent": androidMobileDevice,
          },
        });
        cy.contains("div", "Weiter").click();
        cy.url().should("include", "/formular/welcome");
      });
    });
    describe("and users skip the page", () => {
      it("should go to /bundesIdent/device", () => {
        cy.visit("/bundesIdent/erfolgreich", {
          headers: {
            "user-agent": androidMobileDevice,
          },
        });
        cy.contains("div", "Weiter").click();
        cy.url().should("include", "/formular/welcome");
      });
    });
  });
});

describe("Back to Desktop", () => {
  beforeEach(() => {
    cy.task("setUserIdentified", {
      email: "foo@bar.com",
    });
    cy.login();
  });

  describe("when user is successfully identified", () => {
    describe("when user answers that they start from desktop or tablet", () => {
      it("should redirect user to formular page", () => {
        cy.visit("/bundesIdent/device", {
          headers: {
            "user-agent": androidMobileDevice,
          },
        });
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
        cy.visit("/bundesIdent/device", {
          headers: {
            "user-agent": androidMobileDevice,
          },
        });
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
        cy.visit("/bundesIdent/device", {
          headers: {
            "user-agent": androidMobileDevice,
          },
        });
        cy.contains("div", "Übernehmen & weiter").click();
        cy.contains("div", "Es ist ein Fehler aufgetreten.");
        cy.contains("div", "Bitte treffen Sie eine Auswahl");
      });
    });
  });
});

describe("App Review Page", () => {
  beforeEach(() => {
    cy.task("setUserIdentified", {
      email: "foo@bar.com",
    });
    cy.login();
  });

  describe("when user clicks 'Überspringen'", () => {
    it("should redirect user to '/bundesIdent/device'", () => {
      cy.visit("/bundesIdent/appreview", {
        headers: {
          "user-agent": androidMobileDevice,
        },
      });
      cy.contains("div", "Überspringen").click();
      cy.url().should("include", "/bundesIdent/device");
    });
  });
  describe("when user clicks 'BundesIdent Bewerten'", () => {
    describe("with iOS device", () => {
      it("should redirect current tab to '/bundesIdent/device'", () => {
        cy.visit("/bundesIdent/appreview", {
          headers: {
            "user-agent": iOSMobileDevice,
          },
        });
        cy.contains("div", "BundesIdent Bewerten").click();
        cy.url().should("include", "/bundesIdent/device");
      });
    });
    describe("with Android device", () => {
      it("should redirect current tab to '/bundesIdent/device'", () => {
        cy.visit("/bundesIdent/appreview", {
          headers: {
            "user-agent": androidMobileDevice,
          },
        });
        cy.contains("div", "BundesIdent Bewerten").click();
        cy.url().should("include", "/bundesIdent/device");
      });
    });
  });
});
