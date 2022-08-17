/// <reference types="../../cypress/support" />
const submitBtnSelector = "#nextButton";

describe("Happy Path", () => {
  it("Enter full path until success", () => {
    cy.visit("/");
    cy.contains("a", "Grundsteuererklärung starten").click();

    cy.url().should("include", "/pruefen/start");
    cy.contains(
      "h1",
      "Prüfen Sie in wenigen Schritten, ob Sie unser Tool nutzen können."
    );
    cy.get(`label[for=abgeber-eigentuemer]`).click();
    cy.get(submitBtnSelector).click();

    cy.get(`label[for=eigentuemerTyp-privatperson]`).click();
    cy.get(submitBtnSelector).click();

    cy.get("#bundesland").select("BB");
    cy.get(submitBtnSelector).click();

    cy.get(`label[for=grundstueckArt-einfamilienhaus]`).click();
    cy.get(submitBtnSelector).click();

    cy.get(`label[for=ausland-false]`).click();
    cy.get(submitBtnSelector).click();

    cy.get(`label[for=fremderBoden-false]`).click();
    cy.get(submitBtnSelector).click();

    cy.get(`label[for=beguenstigung-false]`).click();
    cy.get(submitBtnSelector).click();

    cy.get(`label[for=garagen-keiner]`).click();
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
    cy.visit("/pruefen/bundesland");
    cy.contains(
      "h1",
      "Prüfen Sie in wenigen Schritten, ob Sie unser Tool nutzen können."
    );
  });

  it("Does not redirect if directly accessing enabled step", () => {
    cy.visit("/pruefen/start");
    cy.get(`label[for=abgeber-eigentuemer]`).click();
    cy.get(submitBtnSelector).click();

    cy.visit("/pruefen/start");

    cy.contains("legend", "Wer gibt die Grundsteuererklärung ab?");
  });
});

export {};
