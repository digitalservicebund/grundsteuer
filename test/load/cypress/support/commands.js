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

/* eslint-disable no-undef */
Cypress.Commands.add("login", () => {
  // Cookie value obtained by manually logging in with grundsteuer+load-test@digitalservice.bund.de on staging
  cy.setCookie(
    "__Host-session",
    "eyJjc3JmIjoiNTkzOGI2ZTYtMDQ5OS00NmJhLWI2NmEtYzk1ODI5NTUwOWFkIiwidXNlciI6eyJlbWFpbCI6ImdydW5kc3RldWVyK2xvYWQtdGVzdEBkaWdpdGFsc2VydmljZS5idW5kLmRlIiwiaWQiOiI5ZTc3NmE1MC1hZWUyLTRjNDctOWQyMC1mMjJkN2Y2NGNiNDAiLCJpZGVudGlmaWVkIjp0cnVlfX0=.uCm1caCqy9DiYUJwMeT836vdEa3ck0kCWgJwJa1C/qE",
    {
      domain: "grund-stag.dev.ds4g.net",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    }
  );
});
