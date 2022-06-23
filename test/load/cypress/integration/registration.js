/* eslint-disable no-undef, @typescript-eslint/no-var-requires */

describe("form", () => {
  before(() => {
    cy.recordHar({
      content: false,
      rdpHost: "127.0.0.1",
    });
  });

  after(() => {
    cy.saveHar();
  });

  it("Register", () => {
    cy.visit("/registrieren");
    cy.get("[name=email]").type(
      "grundsteuer+load-test-RANDOM@digitalservice.bund.de"
    );

    cy.get("[name=confirmDataPrivacy]").check({ force: true });
    cy.get("[name=confirmTermsOfUse]").check({ force: true });
    cy.get("[name=confirmEligibilityCheck]").check({ force: true });

    cy.get("form button").click();
    cy.contains("h1", "Wir haben Ihnen eine E-Mail gesendet.");
  });
});
