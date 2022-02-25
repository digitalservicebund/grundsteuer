/// <reference types="cypress" />

import { submitBtnSelector } from "../../happypath.spec";

describe("Person adresse route", () => {
  describe("Without data set", () => {
    beforeEach(() => {
      cy.visit("/formular/eigentuemer/person/1/adresse");
    });

    it("Next page should be person telefonnummer", () => {
      cy.get(submitBtnSelector).click();
      cy.url().should(
        "include",
        "/formular/eigentuemer/person/1/telefonnummer"
      );
    });

    it("Previous page should be person angaben", () => {
      cy.get("a").contains("Zurück").click();
      cy.url().should(
        "include",
        "/formular/eigentuemer/person/1/persoenlicheAngaben"
      );
    });
  });
});
