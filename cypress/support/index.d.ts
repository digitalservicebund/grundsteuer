/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Login
     * @example
     * cy.login()
     */
    login(): Chainable<any>;

    bundesland(bundesland: string): Chainable<any>;
  }
}
