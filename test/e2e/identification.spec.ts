/// <reference types="../../cypress/support" />
describe("menu item Identifikation", () => {
  beforeEach(() => {
    // large screen with visible side menu
    cy.viewport(1200, 1000);
    cy.task("setUserUnidentified", {
      userEmail: "foo@bar.com",
    });
  });

  afterEach(() => {
    cy.task("dbRemoveFsc", "foo@bar.com");
    cy.task("setUserUnidentified", {
      userEmail: "foo@bar.com",
    });
  });

  it("should redirect to options page on unidentified user with no FSC request", () => {
    cy.login();
    cy.visit("/formular");
    cy.contains("a", "Identifikation").click();
    cy.location("pathname").should("eq", "/identifikation");
    cy.contains("h1", "Mit welcher Option möchten Sie sich identifizieren?");
  });

  it("should redirect to /fsc/eingeben on user with FSC request", () => {
    cy.task("addFscRequestId", {
      userEmail: "foo@bar.com",
      fscRequestId: "foo",
    });
    cy.login();
    cy.visit("/formular");
    cy.contains("a", "Identifikation").click();
    cy.location("pathname").should("eq", "/fsc/eingeben");
  });

  it("should redirect to /identifikation/erfolgriech on identified user", () => {
    cy.task("setUserIdentified", {
      userEmail: "foo@bar.com",
    });
    cy.login();
    cy.visit("/formular");
    cy.contains("a", "Identifikation").click();
    cy.location("pathname").should("eq", "/identifikation/erfolgreich");
  });
});

export {};
