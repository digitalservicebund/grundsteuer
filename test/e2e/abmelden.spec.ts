/// <reference types="../../cypress/support" />
// @ts-check
describe("Logout", () => {
  const viewportWidths = [400, 600, 900, 1023];
  const urls = ["/anmelden/erfolgreich", "/formular/welcome"];
  viewportWidths.forEach((viewportWidth) => {
    describe(`should display logout menu exactly once on viewport width ${viewportWidth}`, () => {
      urls.forEach((url) => {
        it(`and url ${url}`, () => {
          cy.viewport(viewportWidth, 800);
          cy.login();
          cy.visit(url);
          cy.url().should("include", url);
          cy.get("[data-testid=top-navigation__menu-icon").click();
          cy.get("[data-testid=logout-menu]")
            .filter(":visible")
            .should("have.length", 1);
        });
      });
    });
  });

  describe("should display logout menu exactly once on large screen", () => {
    urls.forEach((url) => {
      it(`and url ${url}`, () => {
        cy.viewport(1024, 800);
        cy.login();
        cy.visit(url);
        cy.url().should("include", url);
        cy.get("[data-testid=top-navigation__menu-icon").should(
          "not.be.visible"
        );
        cy.get("[data-testid=logout-button]")
          .filter(":visible")
          .should("have.length", 1);
      });
    });
  });

  it("should redirect to /abmelden/erfolgreich", () => {
    cy.login();
    cy.visit("/formular/welcome");
    cy.url().should("include", "/formular/welcome");
    cy.get("[data-testid=logout-button]").first().click({ force: true });
    cy.url().should("include", "/abmelden/erfolgreich");
  });

  it("should redirect to /anmelden when trying to access formular being logged out", () => {
    cy.login();
    cy.visit("/formular/welcome");
    cy.url().should("include", "/formular/welcome");
    cy.get("[data-testid=logout-button]").first().click({ force: true });
    cy.url().should("include", "/abmelden/erfolgreich");
    cy.visit("/formular/welcome");
    cy.url().should("include", "/anmelden");
  });
});

export {};
