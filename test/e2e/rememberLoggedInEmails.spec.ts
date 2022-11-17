/// <reference types="../../cypress/support" />

describe("/anmelden/erfolgreich", () => {
  it("should redirect once and add cookie to remember logged-in email", () => {
    cy.login();
    cy.visit("/anmelden/erfolgreich");
    cy.url().should("include", "/anmelden/erfolgreich?r=1");
    cy.getCookie("remember_logged_in_emails").should("exist");
  });
});

export {};
