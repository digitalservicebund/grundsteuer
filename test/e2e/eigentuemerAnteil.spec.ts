/// <reference types="../../cypress/support" />
// @ts-check

beforeEach(() => {
  cy.login();
  cy.visit("/formular/eigentuemer/anzahl");
  cy.get("#anzahl").select("2");
  cy.get("#nextButton").click();
  cy.visit("/formular/eigentuemer/person/1/anteil");
});

describe("Eigentümer:innen anteil step", () => {
  describe("when entering fixed Anteile via radio buttons", () => {
    [
      { zaehler: 1, nenner: 2 },
      { zaehler: 1, nenner: 3 },
      { zaehler: 1, nenner: 4 },
    ].forEach(({ zaehler, nenner }) => {
      it(`should save ${zaehler}/${nenner}`, () => {
        cy.get(`label[for='zaehlerNenner-${zaehler}/${nenner}']`).click();
        cy.get("#nextButton").click();
        cy.url().should(
          "include",
          "/formular/eigentuemer/person/2/persoenlicheAngaben"
        );

        cy.visit("/formular/zusammenfassung");
        cy.contains("summary", "Eigentümer:innen").click();
        cy.contains("dd", `${zaehler} / ${nenner}`);
      });
    });
  });

  describe("when entering valid Anteil via text field ", () => {
    ["1/2", "1/18", "  123   /   10000"].forEach((input) => {
      it(`should save ${input}`, () => {
        cy.get("#userInput").type(input);
        cy.get("#nextButton").click();
        cy.url().should(
          "include",
          "/formular/eigentuemer/person/2/persoenlicheAngaben"
        );
        cy.visit("/formular/zusammenfassung");
        cy.contains("summary", "Eigentümer:innen").click();
        cy.contains("dd", input.replace(/\s/g, "").replace("/", " / "));
      });
    });
  });

  const errorMessages = {
    nennerEmpty:
      "Nenner (hinter dem Schrägstrich): Bitte füllen Sie dieses Feld aus.",
    nennerNotNumber:
      "Nenner (hinter dem Schrägstrich): Darf nur Ziffern beinhalten",
    zaehlerEmpty:
      "Zähler (vor dem Schrägstrich): Bitte füllen Sie dieses Feld aus.",
    zaehlerNotNumber:
      "Zähler (vor dem Schrägstrich): Darf nur Ziffern beinhalten",
    wrongFormat:
      "Bitte tragen Sie den Eigentumsanteil mit einem Schrägstrich als Trennung ein.",
  };

  describe("when entering invalid Anteil via text field ", () => {
    [
      { input: "aaa", error: errorMessages.wrongFormat },
      { input: " 1 /  ", error: errorMessages.nennerEmpty },
      { input: " 1 / bbb  ", error: errorMessages.nennerNotNumber },
      { input: "  / 34 ", error: errorMessages.zaehlerEmpty },
      { input: " ccc / 34", error: errorMessages.zaehlerNotNumber },
      { input: "  / ", error: errorMessages.zaehlerEmpty },
    ].forEach(({ input, error }) => {
      it(`should show error message '${error}' for ${input}`, () => {
        cy.get("#userInput").type(input);
        cy.get("#nextButton").click();
        cy.url().should("include", "/formular/eigentuemer/person/1/anteil");
        cy.contains(error);
      });
    });
  });
});

export {};
