/// <reference types="../../cypress/support" />

describe("/anmelden/erfolgreich", () => {
  it("should redirect once and add cookie to remember login", () => {
    cy.login();
    cy.visit("/anmelden/erfolgreich");
    cy.url().should("include", "/anmelden/erfolgreich?r=1");
    cy.getCookie("login").should("exist");
  });
});

export {};
