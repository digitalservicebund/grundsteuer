/// <reference types="../../cypress/support" />
// @ts-check

beforeEach(() => {
  cy.login();
});

describe("Formular step path handling", () => {
  describe('when path is shortened to "parent/super path"', () => {
    [
      { from: "/formular", to: "/formular/welcome" },
      {
        from: "/formular/eigentuemer",
        to: "/formular/eigentuemer/uebersicht",
      },
      {
        from: "/formular/eigentuemer/person",
        to: "/formular/eigentuemer/person/1/persoenlicheAngaben",
      },
      {
        from: "/formular/grundstueck",
        to: "/formular/grundstueck/uebersicht",
      },
      {
        from: "/formular/grundstueck/flurstueck",
        to: "/formular/grundstueck/flurstueck/1/angaben",
      },
      { from: "/formular", to: "/formular/welcome" },
    ].forEach(({ from, to }) => {
      it(`should redirect ${from} to ${to}`, () => {
        cy.visit(from);
        cy.url().should("include", to);
      });
    });

    it("should redirect /formular/gebaeude to /formular/gebaeude/uebersicht", () => {
      // Match precondition
      cy.visit("/formular/grundstueck/bebaut");
      cy.get(`label[for=bebaut-bebaut]`).click();
      cy.get("#nextButton").click();
      cy.url().should("include", "/grundstueck/haustyp");
      cy.visit("/formular/grundstueck/haustyp");
      cy.get(`label[for=haustyp-einfamilienhaus]`).click();
      cy.get("#nextButton").click();
      cy.url().should("include", "/grundstueck/adresse");

      cy.visit("/formular/gebaeude");
      cy.url().should("include", "/formular/gebaeude/uebersicht");
    });
  });

  describe("when path is valid but with given form data not reachable", () => {
    [
      "/formular/gebaeude",
      "/formular/grundstueck/flurstueck/2/angaben",
    ].forEach((url) => {
      it(`should redirect ${url} to /formular/welcome`, () => {
        cy.visit(url);
        cy.url().should("include", "/formular/welcome");
      });
    });
  });

  describe("when path is invalid, e.g. typo", () => {
    it("should render 404 page", () => {
      cy.visit({ url: "/formular/foobar", failOnStatusCode: false });
      cy.contains("h1", "404");
    });
  });
});

export {};
