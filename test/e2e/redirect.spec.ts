/// <reference types="../../cypress/support" />
// @ts-check
describe("Redirect to initial step when accessing super state url", () => {
  beforeEach(() => {
    cy.login();
  });

  it("should redirect to uebersicht on call to eigentuemer", () => {
    cy.visit("/formular/eigentuemer");
    cy.url().should("include", "/formular/eigentuemer/uebersicht");
  });

  it("should redirect to persoenlicheAngaben of person 1 on call to eigentuemer/person", () => {
    cy.visit("/formular/eigentuemer/person");
    cy.url().should(
      "include",
      "/formular/eigentuemer/person/1/persoenlicheAngaben"
    );
  });

  it("should redirect to uebersicht on call to grundstueck", () => {
    cy.visit("/formular/grundstueck");
    cy.url().should("include", "/formular/grundstueck/uebersicht");
  });

  it("should redirect to angaben of flurstueck 1 on call to grundstueck/flurstueck", () => {
    cy.visit("/formular/grundstueck/flurstueck");
    cy.url().should("include", "/formular/grundstueck/flurstueck/1/angaben");
  });

  it("should redirect to ab1949 on call to gebaeude", () => {
    // Match precondition
    cy.visit("/formular/grundstueck/typ");
    cy.get(`label[for=typ-einfamilienhaus]`).click();
    cy.get("#nextButton").click();

    cy.visit("/formular/gebaeude");
    cy.url().should("include", "/formular/gebaeude/uebersicht");
  });
});

describe("Redirect to formular start step when accessing non-reachable page", () => {
  beforeEach(() => {
    cy.login();
  });

  it("should redirect to formular start on call to gebaeude", () => {
    cy.visit("/formular/gebaeude");
    cy.url().should("include", "/formular/welcome");
  });

  it("should redirect to formular start on call to second flurstueck", () => {
    cy.visit("/formular/grundstueck/flurstueck/2/angaben");
    cy.url().should("include", "/formular/welcome");
  });
});

export {};
