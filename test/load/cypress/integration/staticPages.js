/* eslint-disable no-undef */

describe("static pages", () => {
  before(() => {
    cy.recordHar({
      content: false,
      rdpHost: "127.0.0.1",
    });
  });

  after(() => {
    cy.saveHar();
  });

  it("Home page", () => {
    cy.visit("/");
  });
});
