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
      cy.task("dbRemoveFsc", "foo@bar.com");
      cy.task("dbRemoveAllEricaRequestIds", "foo@bar.com");
      cy.login();
    });

    it("should redirect to /beantragen page", () => {
      cy.visit("/fsc", { failOnStatusCode: false });
      cy.url().should("include", "/fsc/beantragen");
    });
  });

  describe("identified user", () => {
    beforeEach(() => {
      cy.task("dbRemoveAllEricaRequestIds", "foo@bar.com");
      cy.visit("/anmelden");
      cy.get("[name=email]").type("identified-user@example.com");
      cy.get("[name=password]").type("12345678");
      cy.get("[data-testid=submit").click();
    });

    it("should redirect to /formular", () => {
      cy.visit("/fsc", { failOnStatusCode: false });
      cy.url().should("include", "/formular");
    });
  });
});

export {};
