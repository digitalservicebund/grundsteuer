/// <reference types="../../cypress/support" />

const submitBtnSelector = "#nextButton";

describe("Flurstuecke", () => {
  it("should render widget correctly", () => {
    cy.login();
    cy.visit("/formular/grundstueck/anzahl");
    cy.url().should("include", "/formular/grundstueck/anzahl");
    cy.get("#anzahl").select("1");
    cy.get(submitBtnSelector).click();

    cy.url().should("include", `/formular/grundstueck/flurstueck/1/angaben`);

    cy.visit("/formular/grundstueck/anzahl");
    cy.url().should("include", "/formular/grundstueck/anzahl");

    for (let i = 2; i <= 45; i++) {
      cy.contains("button", "Flurstück hinzufügen").should("exist").click();
    }
    cy.contains("button", "Flurstück hinzufügen").should("not.exist");
    for (let i = 1; i <= 45; i++) {
      cy.contains("div", `Flurstück ${i}`);
    }

    cy.visit("/formular/zusammenfassung");
    cy.url().should("include", "/formular/zusammenfassung");
    cy.contains("summary", "Grundstück").should("exist").click();
    cy.get(`div[id="flurstueck-0"]`).nextAll().should("have.length", 44);
  });
});

export {};
