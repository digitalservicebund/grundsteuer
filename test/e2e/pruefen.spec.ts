/// <reference types="../../cypress/support" />
const submitBtnSelector = "#nextButton";

const goThroughFirstSteps = () => {
  cy.visit("/");
  cy.contains("a", "Grundsteuererklärung starten").click();

  cy.url().should("include", "/pruefen/bundesland");
  cy.contains(
    "h1",
    "Prüfen Sie in wenigen Schritten, ob Sie unseren Online-Dienst nutzen können."
  );
  cy.get("#bundesland").select("BB");
  cy.get(submitBtnSelector).click();
};

const goThroughLastSteps = () => {
  cy.get(`label[for=fremderBoden-false]`).click();
  cy.get(submitBtnSelector).click();

  cy.get(`label[for=beguenstigung-false]`).click();
  cy.get(submitBtnSelector).click();

  cy.get(`label[for=abgeber-eigentuemer]`).click();
  cy.get(submitBtnSelector).click();

  cy.get(`label[for=eigentuemerTyp-privatperson]`).click();
  cy.get(submitBtnSelector).click();

  cy.get(`label[for=ausland-false]`).click();
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

  it("Enter full path hof until mehrereEkrlaerungen", () => {
    goThroughFirstSteps();

    cy.get(`label[for=bewohnbar-bewohnbar]`).click();
    cy.get(submitBtnSelector).click();

    cy.get(`label[for=gebaeude-hof]`).click();
    cy.get(submitBtnSelector).click();

    cy.get("label[for=privat-false").click();
    cy.get(submitBtnSelector).click();

    cy.contains("h1", "separate Erklärungen");
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
    cy.visit("/pruefen/fremderBoden");
    cy.contains(
      "h1",
      "Prüfen Sie in wenigen Schritten, ob Sie unseren Online-Dienst nutzen können."
    );
  });

  it("Does not redirect if directly accessing enabled step", () => {
    cy.visit("/pruefen/bundesland");
    cy.get("#bundesland").select("BB");
    cy.get(submitBtnSelector).click();

    cy.visit("/pruefen/bundesland");

    cy.contains("h1", "In welchem Bundesland liegt Ihr Grundstück?");
  });
});

describe("Double-check with returning user before starting", () => {
  it("Redirects to /pruefen/nachfrage", () => {
    cy.setCookie("login", "1");
    cy.visit("/pruefen/bundesland");
    cy.url().should("include", "/pruefen/nachfrage");
    cy.get("[href='/pruefen/bundesland?continue=1']").click();
    cy.url().should("include", "/pruefen/bundesland");
  });
});

export {};
