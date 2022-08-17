/// <reference types="../../cypress/support" />
describe("/fsc", () => {
  it("/fsc routes should only be accessible for logged-in users", () => {
    cy.visit("/fsc", { failOnStatusCode: false });
    cy.url().should("include", "/anmelden");
    cy.visit("/fsc/beantragen", { failOnStatusCode: false });
    cy.url().should("include", "/anmelden");
    cy.visit("/fsc/beantragen/erfolgreich", { failOnStatusCode: false });
    cy.url().should("include", "/anmelden");
  });

  describe("logged-in user", () => {
    beforeEach(() => {
      cy.task("setUserUnidentified", {
        email: "foo@bar.com",
      });
      cy.login();
    });

    it("should redirect to /beantragen page", () => {
      cy.visit("/fsc", { failOnStatusCode: false });
      cy.url().should("include", "/fsc/beantragen");
    });
  });

  describe("identified user", () => {
    beforeEach(() => {
      cy.task("setUserIdentified", {
        email: "foo@bar.com",
      });
      cy.login();
    });

    it("should redirect to /formular", () => {
      cy.visit("/fsc", { failOnStatusCode: false });
      cy.url().should("include", "/formular");
    });

    it("should not disable identification menu", () => {
      cy.visit("/fsc", { failOnStatusCode: false });
      cy.url().should("include", "/formular");
      cy.contains("a", "Identifikation");
    });
  });
});

export {};
