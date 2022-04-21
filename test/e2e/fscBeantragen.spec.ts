/// <reference types="../../cypress/support" />
describe("/beantragen", () => {
  beforeEach(() => {
    cy.login();
  });

  afterEach(() => {
    cy.request("GET", "http://localhost:8000/reset");
  });

  it("should show spinner if data is correct and mockErica returns no result", () => {
    cy.request("GET", "http://localhost:8000/triggerDelayedResponse");
    cy.visit("/fsc/beantragen");
    cy.get("[name=steuerId]").type("04531972802");
    cy.get("[name=geburtsdatum]").type("01.08.1291");
    cy.get("form button").click();
    cy.contains("Ihr Freischaltcode wird beantragt.");
  });

  it("should redirect to success page if mockErica returns success", () => {
    cy.request("GET", "http://localhost:8000/triggerDirectResponse");
    cy.request("GET", "http://localhost:8000/triggerSuccess");
    cy.visit("/fsc/beantragen");
    cy.get("[name=steuerId]").type("04531972802");
    cy.get("[name=geburtsdatum]").type("01.08.1291");
    cy.get("form button").click();
    cy.url().should("include", "/fsc/beantragen/erfolgreich");
  });

  it("should show error message and no spinner if mockErica returns failure", () => {
    cy.request("GET", "http://localhost:8000/triggerDirectResponse");
    cy.request("GET", "http://localhost:8000/triggerFailure");
    cy.visit("/fsc/beantragen");
    cy.get("[name=steuerId]").type("04531972802");
    cy.get("[name=geburtsdatum]").type("01.08.1291");
    cy.get("form button").click();
    cy.contains("Es ist ein Fehler aufgetreten");
    cy.contains("Ihr Freischaltcode wird beantragt.").should("not.exist");
  });
});

export {};
