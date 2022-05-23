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
      cy.task("setUserIdentifiedAttribute", {
        userEmail: "foo@bar.com",
        identified: false,
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
      cy.task("setUserIdentifiedAttribute", {
        userEmail: "foo@bar.com",
        identified: true,
      });
      cy.login();
    });

    it("should redirect to /formular", () => {
      cy.visit("/fsc", { failOnStatusCode: false });
      cy.url().should("include", "/formular");
    });
  });
});

export {};
