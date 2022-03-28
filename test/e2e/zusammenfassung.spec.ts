/// <reference types="../../cypress/support" />
// @ts-check
describe("Zusammenfassung route", () => {
  beforeEach(() => {
    cy.login();
  });

  it("should display the title", () => {
    // uses baseUrl defined in cypress.json configuration
    cy.visit("/formular/zusammenfassung");
    // access DOM Nodes via e.g. class, id, data-test-id
    // & interact with DOM
    cy.get("h1").contains("Zusammenfassung");
  });

  it.skip("should display empty fields on no form input", () => {
    // uses baseUrl defined in cypress.json configuration
    cy.visit("/formular/zusammenfassung");
    // access DOM Nodes via e.g. class, id, data-test-id
    // & interact with DOM
    cy.get("dt").contains("Straße").next().should("be.empty");
  });
});

export {};
