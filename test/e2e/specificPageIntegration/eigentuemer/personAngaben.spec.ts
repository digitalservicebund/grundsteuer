/// <reference types="cypress" />

import { submitBtnSelector } from "../../happypath.spec";

describe("Person name route", () => {
  describe("Without data set", () => {
    beforeEach(() => {
      cy.visit("/formular/eigentuemer/person/1/persoenlicheAngaben");
    });

    it("Next page should be person adresse", () => {
      cy.get(submitBtnSelector).click();
      cy.url().should("include", "/formular/eigentuemer/person/1/adresse");
    });

    it("Previous page should be anzahl eigentuemer", () => {
      cy.get("a").contains("Zurück").click();
      cy.url().should("include", "/formular/eigentuemer/anzahl");
    });
  });

  describe("With two eigentuemer set", () => {
    beforeEach(() => {
      cy.visit("/formular/eigentuemer/anzahl");
      cy.get("#anzahl").select("2");
      cy.get(submitBtnSelector).click();
      cy.visit("/formular/eigentuemer/person/1/persoenlicheAngaben");
    });

    it("Next page should be person adresse", () => {
      cy.get(submitBtnSelector).click();
      cy.url().should("include", "/formular/eigentuemer/person/1/adresse");
    });

    it("Previous page should be verheiratet", () => {
      cy.get("a").contains("Zurück").click();
      cy.url().should("include", "/formular/eigentuemer/verheiratet");
    });
  });
});
