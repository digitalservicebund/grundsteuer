/// <reference types="cypress" />

import { submitBtnSelector } from "../../happypath.spec";

describe("Person telefonnummer route", () => {
  describe("Without data set", () => {
    beforeEach(() => {
      cy.visit("/formular/eigentuemer/person/1/telefonnummer");
    });

    it("Next page should be person steuerId", () => {
      cy.get(submitBtnSelector).click();
      cy.url().should("include", "/formular/eigentuemer/person/1/steuerId");
    });

    it("Previous page should be person adresse", () => {
      cy.get("a").contains("Zurück").click();
      cy.url().should("include", "/formular/eigentuemer/person/1/adresse");
    });
  });
});
