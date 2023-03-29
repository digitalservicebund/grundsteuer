/// <reference types="../../cypress/support" />

describe("Primary option page", () => {
  describe("when user is successfully logged-in", () => {
    it("should show primary option page once", () => {
      cy.login();
      // WHEN I successfully login
      cy.visit("/anmelden/erfolgreich");

      // THEN I click continue button
      cy.contains("a", "Verstanden & weiter").click();
      // THEN I should see bundesident primary option page
      cy.contains(
        "h1",
        "Möchten Sie sich in wenigen Minuten mit Ihrem Ausweis identifizieren?"
      );
      // THEN I click Identifikation mit Ausweis
      cy.contains("a", "Identifikation mit Ausweis").click();

      // WHEN I successfully login second time
      cy.visit("/anmelden/erfolgreich");

      // THEN I click continue button
      cy.contains("a", "Verstanden & weiter").click();

      // THEN I should not see bundesident primary page
      cy.contains("h1", "Mit welcher Option möchten Sie sich identifizieren?");
      cy.url().should("include", "/identifikation");
    });
  });

  describe("when user is logged-in and bundesident_disabled is active", () => {
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
      cy.login();
      cy.visit("/anmelden/erfolgreich");
      cy.contains("a", "Verstanden & weiter").click();
      cy.url().should("include", "/identifikation");
    });
  });

  describe("when user is logged-in and bundesident_down is active", () => {
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
      cy.login();
      cy.visit("/anmelden/erfolgreich");
      cy.contains("a", "Verstanden & weiter").click();
      cy.url().should("include", "/identifikation");
    });
  });
});
