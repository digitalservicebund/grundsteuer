/// <reference types="../../cypress/support" />

const validFreischaltCode = "ABCD-1234-EFGH";

describe("between declration 1 and 2", () => {
  const testUserEmail = "neitherherenorthere@example.com";
  beforeEach(() => {
    cy.task("createUser", {
      email: testUserEmail,
    });
    cy.task("setUserIdentified", {
      userEmail: testUserEmail,
    });
    cy.task("setUserInDeclarationProcessAttribute", {
      userEmail: testUserEmail,
      inDeclarationProcess: false,
    });
    cy.login(testUserEmail);
  });

  afterEach(() => {
    cy.task("deleteUser", {
      userEmail: testUserEmail,
    });
  });

  it("should not display identification in side menu", () => {
    cy.visit("/formular/erfolg");
    cy.contains("h1", "Ihre Grundsteuererklärung wurde erfolgreich versendet.");
    cy.contains("a", "Identifikation").should("not.exist");
  });
});
