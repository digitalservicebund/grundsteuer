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
    cy.get("[name=emailRepeated]").type(
      "grundsteuer+load-test-RANDOM@digitalservice.bund.de"
    );
    cy.get("[name=password]").type("password");
    cy.get("[name=passwordRepeated]").type("password");

    cy.get("[name=confirmDataPrivacy]").check({ force: true });
    cy.get("[name=confirmTermsOfUse]").check({ force: true });

    cy.get("form button").click();
    cy.url().should("include", "/registrieren/erfolgreich");
  });
});
