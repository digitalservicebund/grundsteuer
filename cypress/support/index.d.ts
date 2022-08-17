/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Login
     * @example
     * cy.login()
     */
    login(email?: string): Chainable<any>;

    bundesland(bundesland: string): Chainable<any>;
  }
}
