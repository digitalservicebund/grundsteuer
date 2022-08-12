/// <reference types="../../cypress/support" />
// @ts-check

describe("Download pdf", () => {
  before(() => {
    cy.task("dbResetUser", "foo@bar.com");
  });
  it("should redirect to /anmelden when trying to access being logged out", () => {
    cy.visit("/download/pdf");
    cy.url().should("include", "/anmelden");
  });

  it("should return error if no pdf set", () => {
    cy.login();
    cy.request({
      url: "/download/pdf",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  describe("pdf set for logged-in user", () => {
    beforeEach(() => {
      cy.login();
      cy.task("setDeclarationMetadata", {
        userEmail: "foo@bar.com",
        transferticket: "transferticket",
        pdf: "Test-PDF-Content",
      });
    });

    afterEach(() => {
      cy.task("dbRemoveUserPdf", {
        userEmail: "foo@bar.com",
      });
    });

    it("should download a file with correct content", () => {
      cy.request("/download/pdf").then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.include(
          Buffer.from("Test-PDF-Content", "base64")
        );
        expect(response.headers["content-type"]).to.eq("application/pdf");
        expect(response.headers["content-disposition"]).to.contain(
          `attachment; filename="Grundsteuererklaerung.pdf"`
        );
      });
    });
  });
});

export {};
