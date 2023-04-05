/// <reference types="../../cypress/support" />

describe("Primary option page", () => {
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

  describe("user clicks on sidebar identifikation button", () => {
    it("should see bundesident once", () => {
      // WHEN I successfully login
      cy.login();
      cy.viewport(1200, 1000); // element is invisible, we need to set the screen bigger
      cy.visit("/anmelden/erfolgreich");
      // THEN I click identification button on the left sidebar
      cy.get("#sidebar-navigation-content #icon-lock").click();
      // THEN I should see bundesident primary page
      cy.contains(
        "h1",
        "Möchten Sie sich in wenigen Minuten mit Ihrem Ausweis identifizieren?"
      );
      // THEN I click identification button on the left sidebar
      cy.get("#sidebar-navigation-content #icon-lock").click();
      // THEN I should see identification option page
      cy.contains("h1", "Mit welcher Option möchten Sie sich identifizieren?");
    });

    it("should go to primary option page when in /formular route", () => {
      // WHEN I successfully login
      cy.login();
      cy.viewport(1200, 1000); // element is invisible, we need to set the screen bigger
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
