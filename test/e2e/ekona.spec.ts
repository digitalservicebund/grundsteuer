/// <reference types="../../cypress/support" />

describe("/ekona", () => {
  it("/ekona routes should only be accessible for logged-in users", () => {
    cy.visit("/ekona", { failOnStatusCode: false });
    cy.url().should("include", "/anmelden");
    cy.visit("/ekona/erfolgreich", { failOnStatusCode: false });
    cy.url().should("include", "/anmelden");
  });

  describe("logged-in user but not identified", () => {
    beforeEach(() => {
      cy.task("setUserUnidentified", {
        email: "foo@bar.com",
      });
      cy.login();
    });
    after(() => {
      cy.task("setUserUnidentified", {
        email: "foo@bar.com",
        identified: false,
      });
    });

    it("should redirect to /identifikation page from erfolgreich", () => {
      cy.visit("/ekona/erfolgreich", { failOnStatusCode: false });
      cy.url().should("include", "/identifikation");
    });

    it("should identify user if correct certificate provided", () => {
      cy.visit("/ekona/", { failOnStatusCode: false });
      cy.url().should("include", "/ekona");
      cy.get(
        "form[action='https://e4k-portal.een.elster.de/ekona/sso'] button"
      ).click();

      cy.origin("https://e4k-portal.een.elster.de/", () => {
        cy.url().should(
          "include",
          "https://e4k-portal.een.elster.de/ekona/login/softpse"
        );
      });
    });

    it(
      "should enforce rate limiting",
      {
        retries: {
          runMode: 5,
          openMode: 5,
        },
      },
      () => {
        cy.visit("/ekona/", { failOnStatusCode: false });

        for (let i = 0; i < 6; i++) {
          cy.reload();
        }
        cy.contains("h1", "Zu viele Zugriffe.");
      }
    );
  });

  describe("identified user", () => {
    beforeEach(() => {
      cy.task("setUserIdentified", {
        email: "foo@bar.com",
      });
      cy.login();
    });

    it("should redirect to /formular", () => {
      cy.visit("/ekona", { failOnStatusCode: false });
      cy.url().should("include", "/formular");
    });

    it("should not disable identification menu", () => {
      cy.visit("/ekona", { failOnStatusCode: false });
      cy.url().should("include", "/formular");
      cy.contains("a", "Identifikation");
    });
  });
});

export {};
