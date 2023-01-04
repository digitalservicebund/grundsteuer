/// <reference types="../../cypress/support" />
const submitBtnSelector = "#nextButton";

const goThroughFirstSteps = () => {
  cy.visit("/");
  cy.contains("a", "Grundsteuererklärung starten").click();

  cy.url().should("include", "/pruefen/start");
  cy.contains(
    "h1",
    "Prüfen Sie in wenigen Schritten, ob Sie unseren Online-Dienst nutzen können."
  );
  cy.get(`label[for=abgeber-eigentuemer]`).click();
  cy.get(submitBtnSelector).click();

  cy.get(`label[for=eigentuemerTyp-privatperson]`).click();
  cy.get(submitBtnSelector).click();

  cy.get("#bundesland").select("BB");
  cy.get(submitBtnSelector).click();
};

const goThroughLastSteps = () => {
  cy.get(`label[for=ausland-false]`).click();
  cy.get(submitBtnSelector).click();

  cy.get(`label[for=fremderBoden-false]`).click();
  cy.get(submitBtnSelector).click();

  cy.get(`label[for=beguenstigung-false]`).click();
  cy.get(submitBtnSelector).click();

  cy.contains(
    "h1",
    "Sie können diesen Online-Dienst für Ihre Grundsteuererklärung nutzen."
  );
};

describe("Happy Paths", () => {
  it("Enter full path bewohnbar until success", () => {
    goThroughFirstSteps();

    cy.get(`label[for=bewohnbar-bewohnbar]`).click();
    cy.get(submitBtnSelector).click();

    cy.get(`label[for=gebaeude-einfamilienhaus]`).click();
    cy.get(submitBtnSelector).click();

    goThroughLastSteps();
  });

  it("Enter full path unbewohnbar until success", () => {
    goThroughFirstSteps();

    cy.get(`label[for=bewohnbar-unbewohnbar]`).click();
    cy.get(submitBtnSelector).click();

    cy.get(`label[for=gebaeude-imBau]`).click();
    cy.get(submitBtnSelector).click();

    goThroughLastSteps();
  });

  it("Enter full path unbebaut until success", () => {
    goThroughFirstSteps();

    cy.get(`label[for=bewohnbar-unbebaut]`).click();
    cy.get(submitBtnSelector).click();

    cy.get(`label[for=art-baureif]`).click();
    cy.get(submitBtnSelector).click();

    goThroughLastSteps();
  });

  it("Enter full path unbebaut until lufSpezial", () => {
    goThroughFirstSteps();

    cy.get(`label[for=bewohnbar-bewohnbar]`).click();
    cy.get(submitBtnSelector).click();

    cy.get(`label[for=gebaeude-hof]`).click();
    cy.get(submitBtnSelector).click();

    cy.contains("h1", "Zwei Erklärungen bitte");
  });
});

describe("Order Enforcing", () => {
  it("Redirects if directly accessing success step", () => {
    cy.visit("/pruefen/nutzung");
    cy.contains(
      "h1",
      "Prüfen Sie in wenigen Schritten, ob Sie unseren Online-Dienst nutzen können."
    );
  });

  it("Redirects if directly accessing disabled step", () => {
    cy.visit("/pruefen/bundesland");
    cy.contains(
      "h1",
      "Prüfen Sie in wenigen Schritten, ob Sie unseren Online-Dienst nutzen können."
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

describe("Double-check with returning user before starting", () => {
  it("Redirects to /pruefen/nachfrage", () => {
    cy.setCookie("login", "1");
    cy.visit("/pruefen/start");
    cy.url().should("include", "/pruefen/nachfrage");
    cy.get("[href='/pruefen/start?continue=1']").click();
    cy.url().should("include", "/pruefen/start");
  });
});

export {};
