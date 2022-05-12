/// <reference types="../../cypress/support" />
// @ts-check

describe("Download transferticket", () => {
  before(() => {
    cy.task("dbResetUser", "foo@bar.com");
  });
  it("should redirect to /anmelden when trying to access being logged out", () => {
    cy.visit("/download/transferticket");
    cy.url().should("include", "/anmelden");
  });

  it("should return error if no tranferticket set", () => {
    cy.login();
    cy.request({
      url: "/download/transferticket",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(500);
    });
  });

  describe("Transferticket set for logged-in user", () => {
    beforeEach(() => {
      cy.login();
      cy.task("setUserTransferticket", {
        userEmail: "foo@bar.com",
        transferticket: "Test-TransferTicket",
      });
    });

    afterEach(() => {
      cy.task("dbRemoveUserTransferticket", {
        userEmail: "foo@bar.com",
      });
    });

    it("should download a file with correct content", () => {
      cy.request("/download/transferticket").then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.include("Test-TransferTicket");
        expect(response.headers["content-type"]).to.eq("application/txt");
        expect(response.headers["content-disposition"]).to.eq(
          `attachment; filename="TransferticketGrundsteuererklaerung.txt"`
        );
      });
    });
  });
});

export {};
