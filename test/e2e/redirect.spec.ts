/// <reference types="cypress" />
// @ts-check
describe("Redirect to initial step when accessing super state url", () => {
  it("should redirect to anzahl on call to eigentuemer", () => {
    cy.visit("/formular/eigentuemer");
    cy.url().should("include", "/formular/eigentuemer/anzahl");
  });

  it("should redirect to persoenlicheAngaben of person 1 on call to eigentuemer/person", () => {
    cy.visit("/formular/eigentuemer/person");
    cy.url().should(
      "include",
      "/formular/eigentuemer/person/1/persoenlicheAngaben"
    );
  });

  it("should redirect to adresse on call to grundstueck", () => {
    cy.visit("/formular/grundstueck");
    cy.url().should("include", "/formular/grundstueck/adresse");
  });

  it("should redirect to angaben of flurstueck 1 on call to eigentuemer/person", () => {
    cy.visit("/formular/eigentuemer/person");
    cy.url().should(
      "include",
      "/formular/eigentuemer/person/1/persoenlicheAngaben"
    );
  });

  it("should redirect to ab1949 on call to gebaeude", () => {
    // Match precondition
    cy.visit("/formular/grundstueck/typ");
    cy.get(`label[for=typ-einfamilienhaus]`).click();
    cy.get("#nextButton").click();

    cy.visit("/formular/gebaeude");
    cy.url().should("include", "/formular/gebaeude/ab1949");
  });
});

describe("Redirect to formular start step when accessing non-reachable page", () => {
  it("should redirect to formular start on call to gebaeude", () => {
    cy.visit("/formular/gebaeude");
    cy.url().should("include", "/formular/grundstueck/adresse");
  });

  it("should redirect to formular start on call to second flurstueck", () => {
    cy.visit("/formular/grundstueck/flurstueck/2/angaben");
    cy.url().should("include", "/formular/grundstueck/adresse");
  });
});

export {};
