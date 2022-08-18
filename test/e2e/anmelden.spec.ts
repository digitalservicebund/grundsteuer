/// <reference types="../../cypress/support" />
// @ts-check
describe("/anmelden", () => {
  before(() => {
    cy.task("dbResetUser", "foo@bar.com");
  });

  it("simple success path", () => {
    cy.visit("/anmelden");
    cy.get("[name=email]").type("foo@bar.com");
    cy.get("form button").click();
    cy.url().should("include", "/anmelden/email");
    cy.contains("h1", "Wir haben Ihnen eine E-Mail gesendet.");
  });

  it("should succeed with not lowercase mail", () => {
    cy.visit("/anmelden");
    cy.get("[name=email]").type("fOO@bAr.coM");
    cy.get("form button").click();
    cy.url().should("include", "/anmelden/email");
    cy.contains("h1", "Wir haben Ihnen eine E-Mail gesendet.");
  });

  it("should not fail on wrong username", () => {
    cy.visit("/anmelden");
    cy.get("[name=email]").type("bar@bar.com");
    cy.get("form button").click();
    cy.url().should("include", "/anmelden/email");
    cy.contains("h1", "Wir haben Ihnen eine E-Mail gesendet.");
  });
});

describe("/anmelden/erfolg", () => {
  const email = "foo@bar.com";
  beforeEach(() => {
    cy.task("dbResetUser", email);
  });
  const cases = [
    {
      identified: false,
      inDeclarationProcess: false,
      expectedUrl: "/formular/erfolg",
    },
    {
      identified: false,
      inDeclarationProcess: true,
      expectedUrl: "/identifikation",
    },
    {
      identified: true,
      inDeclarationProcess: false,
      expectedUrl: "/formular/erfolg",
    },
    {
      identified: true,
      inDeclarationProcess: true,
      expectedUrl: "/formular/welcome",
    },
  ];

  cases.forEach(({ identified, inDeclarationProcess, expectedUrl }) => {
    it(`identified: ${identified} inDeclarationProcess: ${inDeclarationProcess} should link ${expectedUrl}`, () => {
      cy.task("setIdentified", {
        email,
        identified: identified,
      });

      cy.task("setUserInDeclarationProcessAttribute", {
        email,
        inDeclarationProcess: inDeclarationProcess,
      });

      cy.login();
      cy.visit("/anmelden/erfolgreich");
      cy.contains("h1", "angemeldet");
      cy.get("[data-testid=continue]").click();
      cy.location("pathname").should("eq", expectedUrl);
    });
  });
});
export {};
