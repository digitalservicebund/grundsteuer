/* eslint-disable no-undef */

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("login", (email) => {
  cy.visit("/anmelden");
  cy.get("[name=email]").type(email ? email : "foo@bar.com");
  cy.get("[data-testid=submit").click();
  cy.url().should("contain", "/anmelden/email");
});

Cypress.Commands.add("bundesland", (bundesland) => {
  cy.visit("/formular/grundstueck/adresse");
  cy.get("#plz").clear().type("12345");
  cy.get("#ort").clear().type("baz");
  cy.get("#bundesland").select(bundesland);
  cy.get("#nextButton").click();
});
