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

  it("redirects if user is inDeclarationProcess", () => {
    cy.login();
    cy.visit("/formular/erfolg");
    cy.url().should("include", "/formular/welcome");
  });

  describe("with Logged in and not inDeclarationProcess user", () => {
    beforeEach(() => {
      cy.login();
      cy.task("setUserInDeclarationProcessAttribute", {
        email: "foo@bar.com",
        inDeclarationProcess: false,
      });
    });

    afterEach(() => {
      cy.task("setUserInDeclarationProcessAttribute", {
        email: "foo@bar.com",
        inDeclarationProcess: true,
      });
    });

    describe("No PDF and Transferticket set", () => {
      it("should show disabled download buttons", () => {
        cy.visit("/formular/erfolg");
        cy.contains("button", "Transferticket").should("be.disabled");
        cy.contains("button", "PDF").should("be.disabled");
      });
    });

    describe("pdf and transferticket set for logged-in user", () => {
      beforeEach(() => {
        cy.task("setDeclarationMetadata", {
          email: "foo@bar.com",
          transferticket: "Test-Transferticket",
          pdf: "Test-PDF-Content",
        });
      });

      afterEach(() => {
        cy.task("dbRemoveUserPdf", {
          email: "foo@bar.com",
        });
        cy.task("dbRemoveUserTransferticket", {
          email: "foo@bar.com",
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
});

export {};
