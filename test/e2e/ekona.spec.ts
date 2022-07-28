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
      cy.task("setUserIdentifiedAttribute", {
        userEmail: "foo@bar.com",
        identified: false,
      });
      cy.login();
    });
    after(() => {
      cy.task("setUserIdentifiedAttribute", {
        userEmail: "foo@bar.com",
        identified: false,
      });
    });

    it("should redirect to /identifikation page from erfolgreich", () => {
      cy.visit("/ekona/erfolgreich", { failOnStatusCode: false });
      cy.url().should("include", "/identifikation");
    });

    it("should identify user if correct certificat provided", () => {
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
  });

  describe("identified user", () => {
    beforeEach(() => {
      cy.task("setUserIdentifiedAttribute", {
        userEmail: "foo@bar.com",
        identified: true,
      });
      cy.login();
    });

    it("should redirect to /formular", () => {
      cy.visit("/ekona", { failOnStatusCode: false });
      cy.url().should("include", "/formular");
    });
  });
});

export {};
