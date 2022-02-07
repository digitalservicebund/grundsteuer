/// <reference types="cypress" />
// @ts-check
describe("Zusammenfassung route", () => {
  it("should display the title", () => {
    // uses baseUrl defined in cypress.json configuration
    cy.visit("/steps/zusammenfassung");
    // access DOM Nodes via e.g. class, id, data-test-id
    // & interact with DOM
    cy.get("h1").contains("Zusammenfassung");
  });

  it("should display empty fields on no form input", () => {
    // uses baseUrl defined in cypress.json configuration
    cy.visit("/steps/zusammenfassung");
    // access DOM Nodes via e.g. class, id, data-test-id
    // & interact with DOM
    cy.get("dt").contains("Straße").next().should("be.empty");
  });
});
