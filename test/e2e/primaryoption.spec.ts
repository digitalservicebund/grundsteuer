/// <reference types="../../cypress/support" />

describe("Primary option page", () => {
  describe("user clicks on sidebar identifikation button", () => {
    beforeEach(() => {
      // WHEN I successfully login
      cy.login();
      cy.viewport(1200, 1000); // element is invisible, we need to set the screen bigger
    });

    it("should go to primary option page when in /formular route", () => {
      cy.visit("/formular");
      // THEN I click identification button on the left sidebar
      cy.get("#sidebar-navigation-content #icon-lock").click();
      // THEN I should see bundesident primary page
      cy.contains(
        "h1",
        "Möchten Sie sich in wenigen Minuten mit Ihrem Ausweis identifizieren?"
      );
    });
  });

  describe("when user has an FSC request and no identification", () => {
    function createFscRequest(
      createdAt: Date = new Date(new Date().setDate(new Date().getDate() - 2))
    ) {
      cy.task("addFscRequestId", {
        email: "foo@bar.com",
        fscRequestId: "foo",
        createdAt,
      });
    }

    beforeEach(() => {
      cy.task("setUserUnidentified", {
        email: "foo@bar.com",
      });
    });

    afterEach(() => {
      cy.task("dbResetUser", "foo@bar.com");
    });

    it("should not show BundesIdent primary option", () => {
      createFscRequest(new Date());
      // WHEN I successfully login
      cy.login();
      cy.viewport(1200, 1000); // element is invisible, we need to set the screen bigger
      cy.visit("/formular");
      // THEN I click identification button on the left sidebar
      cy.get("#sidebar-navigation-content #icon-lock").click();
      // THEN I should not see bundesident primary page
      cy.contains("h1", "Ihr Freischaltcode wurde beantragt");
    });
  });

  describe("when bundesident_disabled is active", () => {
    before(() => {
      cy.task("dbResetUser", "foo@bar.com");
      cy.task("enableFlag", {
        name: "grundsteuer.bundesident_disabled",
      });
      cy.wait(1000);
    });

    after(() => {
      cy.task("disableFlag", {
        name: "grundsteuer.bundesident_disabled",
      });
    });

    it("should not show primary option page", () => {
      // WHEN I login
      cy.login();
      // THEN I should see success login page
      cy.visit("/anmelden/erfolgreich");
      // THEN I click continue
      cy.contains("a", "Verstanden & weiter").click();
      // THEN I should not see bundesident primary page
      cy.url().should("include", "/identifikation");
    });
  });

  describe("when bundesident_down is active", () => {
    before(() => {
      cy.task("dbResetUser", "foo@bar.com");
      cy.task("enableFlag", {
        name: "grundsteuer.bundesident_down",
      });
      cy.wait(1000);
    });
    after(() => {
      cy.task("disableFlag", {
        name: "grundsteuer.bundesident_down",
      });
    });

    it("should not show primary option page", () => {
      // WHEN I login
      cy.login();
      // THEN I should see success login page
      cy.visit("/anmelden/erfolgreich");
      // THEN I click continue
      cy.contains("a", "Verstanden & weiter").click();
      // THEN I should not see bundesident primary page
      cy.url().should("include", "/identifikation");
    });
  });
});
