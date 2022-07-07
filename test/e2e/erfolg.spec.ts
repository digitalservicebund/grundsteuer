/// <reference types="../../cypress/support" />
// @ts-check

describe("/formular/erfolg page", () => {
  before(() => {
    cy.task("dbResetUser", "foo@bar.com");
  });

  it("redirects if user not logged in", () => {
    cy.visit("/formular/erfolg");
    cy.url().should("include", "/anmelden");
  });

  describe("No PDF and Transferticket set", () => {
    it("should show disabled download buttons", () => {
      cy.login();
      cy.visit("/formular/erfolg");
      cy.contains("button", "Transferticket").should("be.disabled");
      cy.contains("button", "PDF").should("be.disabled");
    });
  });

  describe("pdf and transferticket set for logged-in user", () => {
    beforeEach(() => {
      cy.login();
      cy.task("setUserPdf", {
        userEmail: "foo@bar.com",
        pdf: "Test-PDF-Content",
      });
      cy.task("setUserTransferticket", {
        userEmail: "foo@bar.com",
        transferticket: "Test-Transferticket",
      });
    });

    afterEach(() => {
      cy.task("dbRemoveUserPdf", {
        userEmail: "foo@bar.com",
      });
      cy.task("dbRemoveUserTransferticket", {
        userEmail: "foo@bar.com",
      });
    });

    it("should show enabled download links", () => {
      cy.visit("/formular/erfolg");
      cy.contains("a", "Transferticket")
        .should("be.not.disabled")
        .should("have.attr", "href")
        .and("include", "download/transferticket");
      cy.contains("a", "PDF")
        .should("be.not.disabled")
        .should("have.attr", "href")
        .and("include", "download/pdf");
    });
  });
});

export {};
