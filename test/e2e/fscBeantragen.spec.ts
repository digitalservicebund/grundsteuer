/// <reference types="../../cypress/support" />

const validSteuerId = "77 819 250 434";

describe("/beantragen", () => {
  beforeEach(() => {
    cy.request("GET", "http://localhost:8000/reset");
    cy.task("dbRemoveFsc", "foo@bar.com");
    cy.login();
  });

  afterEach(() => {
    cy.request("GET", "http://localhost:8000/reset");
    cy.task("dbRemoveFsc", "foo@bar.com");
    cy.task("dbRemoveEricaRequestId", "foo@bar.com");
  });

  it("should show spinner if data is correct and mockErica returns no result", () => {
    cy.request("GET", "http://localhost:8000/triggerDelayedResponse");
    cy.visit("/fsc/beantragen");
    cy.get("[name=steuerId]").type(validSteuerId);
    cy.get("[name=geburtsdatum]").type("01.08.1291");
    cy.get("form button").click();
    cy.contains("Ihr Freischaltcode wird beantragt.");
  });

  it("should show error messages and no spinner if user input is invalid", () => {
    cy.request("GET", "http://localhost:8000/triggerDelayedResponse");
    cy.visit("/fsc/beantragen");
    cy.get("[name=steuerId]").type("invalid");
    cy.get("[name=geburtsdatum]").type("invalid");
    cy.get("form button").click();
    cy.contains("Bitte geben Sie Ihr Geburtsdatum im Format TT.MM.JJJJ ein");
    cy.contains(
      "Die Steuer-Identifikationsnummer ist genau 11-stellig. Bitte überprüfen Sie Ihre Eingabe."
    );
    cy.contains("Ihr Freischaltcode wird beantragt.").should("not.exist");
  });

  it("should show spinner if ericaRequestId already in database", () => {
    cy.task("addEricaRequestIdFscAntrag", {
      userEmail: "foo@bar.com",
      ericaRequestId: "foo",
    });
    cy.visit("/fsc/beantragen");
    cy.contains("Ihr Freischaltcode wird beantragt.");
  });

  it("should redirect to success page if mockErica returns success", () => {
    cy.request("GET", "http://localhost:8000/triggerDirectResponse");
    cy.request("GET", "http://localhost:8000/triggerSuccess");
    cy.visit("/fsc/beantragen");
    cy.get("[name=steuerId]").type(validSteuerId);
    cy.get("[name=geburtsdatum]").type("01.08.1291");
    cy.get("form button").click();
    cy.url().should("include", "/fsc/beantragen/erfolgreich");
  });

  it("should show error message and no spinner if mockErica returns failure", () => {
    cy.request("GET", "http://localhost:8000/triggerDirectResponse");
    cy.request("GET", "http://localhost:8000/triggerFailure");
    cy.visit("/fsc/beantragen");
    cy.get("[name=steuerId]").type(validSteuerId);
    cy.get("[name=geburtsdatum]").type("01.08.1291");
    cy.get("form button").click();
    cy.contains("Es ist ein Fehler aufgetreten");
    cy.contains("Ihr Freischaltcode wird beantragt.").should("not.exist");
  });

  it("should redirect to success page if it was already successful", () => {
    cy.task("addFscRequestId", {
      userEmail: "foo@bar.com",
      fscRequestId: "foo",
    });
    cy.visit("/fsc/beantragen");
    cy.url().should("include", "/fsc/beantragen/erfolgreich");
  });

  it("should show 500 page if failure and unexpected error", () => {
    //Because we do not reload the page we need to intercept the call in the background
    cy.intercept(
      "GET",
      "/fsc/beantragen?index=&_data=routes%2Ffsc%2Fbeantragen%2Findex"
    ).as("beantragen");
    cy.request("GET", "http://localhost:8000/triggerDirectResponse");
    cy.request("GET", "http://localhost:8000/triggerFailure");
    cy.request("GET", "http://localhost:8000/triggerUnexpectedFailure");
    cy.visit("/fsc/beantragen");
    cy.get("[name=steuerId]").type(validSteuerId);
    cy.get("[name=geburtsdatum]").type("01.08.1291");
    cy.get("form button").click();
    cy.wait("@beantragen").then((intercept) => {
      expect(intercept.response?.statusCode == 500);
    });
    cy.contains("Da ist etwas schiefgelaufen");
  });
});

export {};
