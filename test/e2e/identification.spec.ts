/// <reference types="../../cypress/support" />
describe("menu item Identifikation", () => {
  beforeEach(() => {
    // large screen with visible side menu
    cy.viewport(1200, 1000);
    cy.task("setUserUnidentified", {
      email: "foo@bar.com",
    });
  });

  afterEach(() => {
    cy.task("dbRemoveFsc", "foo@bar.com");
    cy.task("setUserUnidentified", {
      email: "foo@bar.com",
    });
  });

  it("should redirect to options page on unidentified user with no FSC request", () => {
    cy.login();
    cy.visit("/formular");
    cy.contains("a", "Identifikation").click();
    cy.location("pathname").should("eq", "/bundesIdent/primaryoption");
    cy.contains("h1", "Mit welcher Option möchten Sie sich identifizieren?");
  });

  it("should redirect to /fsc on user with FSC request", () => {
    cy.task("addFscRequestId", {
      email: "foo@bar.com",
      fscRequestId: "foo",
      createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
    });
    cy.login();
    cy.visit("/formular");
    cy.contains("a", "Identifikation").click();
    cy.location("pathname").should("eq", "/fsc");
  });

  it("should redirect to /identifikation/erfolgriech on identified user", () => {
    cy.task("setUserIdentified", {
      email: "foo@bar.com",
    });
    cy.login();
    cy.visit("/formular");
    cy.contains("a", "Identifikation").click();
    cy.location("pathname").should("eq", "/identifikation/erfolgreich");
  });
});

export {};
