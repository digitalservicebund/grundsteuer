/// <reference types="cypress" />

import { submitBtnSelector } from "../../happypath.spec";

describe("Person steuerId route", () => {
  describe("Without data set", () => {
    beforeEach(() => {
      cy.visit("/formular/eigentuemer/person/1/steuerId");
    });

    it("Next page should be person gesetzlicherVertreter", () => {
      cy.get(submitBtnSelector).click();
      cy.url().should(
        "include",
        "/formular/eigentuemer/person/1/gesetzlicherVertreter"
      );
    });

    it("Previous page should be person telefonnummer", () => {
      cy.get("a").contains("Zurück").click();
      cy.url().should(
        "include",
        "/formular/eigentuemer/person/1/telefonnummer"
      );
    });
  });
});
