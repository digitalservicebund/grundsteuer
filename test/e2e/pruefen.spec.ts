/// <reference types="../../cypress/support" />
const submitBtnSelector = "#nextButton";

describe("Happy Path", () => {
  it("Enter full path until success", () => {
    cy.visit("/");
    cy.contains("a", "Kann ich teilnehmen?").click();

    cy.url().should("include", "/pruefen/eigentuemerTyp");
    cy.contains(
      "h1",
      "Prüfen Sie in wenigen Schritten, ob Sie unser Tool nutzen können."
    );
    cy.get(`label[for=eigentuemerTyp-privatperson]`).click();
    cy.get(submitBtnSelector).click();

    cy.get(`label[for=isErbengemeinschaft-noErbengemeinschaft]`).click();
    cy.get(submitBtnSelector).click();

    cy.get("#bundesland").select("BB");
    cy.get(submitBtnSelector).click();

    cy.get(`label[for=grundstueckArt-einfamilienhaus]`).click();
    cy.get(submitBtnSelector).click();

    cy.get(`label[for=garagen-garageAufGrundstueck]`).click();
    cy.get(submitBtnSelector).click();

    cy.get(`label[for=ausland-false]`).click();
    cy.get(submitBtnSelector).click();

    cy.get(`label[for=fremderBoden-false]`).click();
    cy.get(submitBtnSelector).click();

    cy.get(`label[for=beguenstigung-false]`).click();
    cy.get(submitBtnSelector).click();

    cy.get(`label[for=elster-false]`).click();
    cy.get(submitBtnSelector).click();

    cy.contains(
      "h1",
      "Sie können diesen Online-Dienst für Ihre Grundsteuererklärung nutzen."
    );
  });
});

describe("Order Enforcing", () => {
  it("Redirects if directly accessing success step", () => {
    cy.visit("/pruefen/nutzung");
    cy.contains(
      "h1",
      "Prüfen Sie in wenigen Schritten, ob Sie unser Tool nutzen können."
    );
  });

  it("Redirects if directly accessing disabled step", () => {
    cy.visit("/pruefen/erbengemeinschaft");
    cy.contains(
      "h1",
      "Prüfen Sie in wenigen Schritten, ob Sie unser Tool nutzen können."
    );
  });

  it("Does not redirect if directly accessing enabled step", () => {
    cy.visit("/pruefen/eigentuemerTyp");
    cy.get(`label[for=eigentuemerTyp-privatperson]`).click();
    cy.get(submitBtnSelector).click();
    cy.get(`label[for=isErbengemeinschaft-noErbengemeinschaft]`).click();
    cy.get(submitBtnSelector).click();

    cy.visit("/pruefen/eigentuemerTyp");

    cy.contains(
      "legend",
      "Wer oder für wen soll die Grundsteuererklärung abgegeben werden?"
    );
  });
});

export {};
