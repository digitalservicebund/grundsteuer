/// <reference types="../../cypress/support" />
// @ts-check
xdescribe("/anmelden", () => {
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

describe("/anmelden/erfolgreich", () => {
  describe("nextLink", () => {
    const email = "foo@bar.com";
    beforeEach(() => {
      cy.task("dbResetUser", email);
    });
    const cases = [
      {
        identified: false,
        inDeclarationProcess: false,
        fscRequest: false,
        expectedUrl: "/formular/erfolg",
      },
      {
        identified: false,
        inDeclarationProcess: true,
        fscRequest: false,
        expectedUrl: "/identifikation",
      },
      {
        identified: false,
        inDeclarationProcess: true,
        fscRequest: true,
        expectedUrl: "/formular/welcome",
      },
      {
        identified: true,
        inDeclarationProcess: false,
        fscRequest: false,
        expectedUrl: "/formular/erfolg",
      },
      {
        identified: true,
        inDeclarationProcess: true,
        fscRequest: false,
        expectedUrl: "/formular/welcome",
      },
    ];

    cases.forEach(
      ({ identified, inDeclarationProcess, fscRequest, expectedUrl }) => {
        it(`identified: ${identified} inDeclarationProcess: ${inDeclarationProcess} fscRequest: ${fscRequest} should link ${expectedUrl}`, () => {
          cy.task("setIdentified", {
            email,
            identified: identified,
          });

          cy.task("setUserInDeclarationProcessAttribute", {
            email,
            inDeclarationProcess: inDeclarationProcess,
          });

          if (fscRequest) {
            cy.task("addFscRequestId", {
              email,
              fscRequestId: "foo",
            });
          }

          cy.login();
          cy.visit("/anmelden/erfolgreich");
          cy.contains("h1", "angemeldet");
          cy.get("[data-testid=continue]").click();
          cy.location("pathname").should("eq", expectedUrl);
        });
      }
    );
  });

  describe("fscLink", () => {
    const email = "foo@bar.com";
    beforeEach(() => {
      cy.task("dbResetUser", email);
    });
    const cases = [
      {
        fscRequest: false,
        fscRequestAgeInDays: undefined,
        expectedUrl: undefined,
      },
      {
        fscRequest: true,
        fscRequestAgeInDays: 0,
        expectedUrl: undefined,
      },
      {
        fscRequest: true,
        fscRequestAgeInDays: 1,
        expectedUrl: "/fsc/eingeben",
      },
      {
        fscRequest: true,
        fscRequestAgeInDays: 90,
        expectedUrl: "/fsc/eingeben",
      },
      {
        fscRequest: true,
        fscRequestAgeInDays: 91,
        expectedUrl: "/fsc/eingeben",
      },
    ];

    cases.forEach(({ fscRequest, fscRequestAgeInDays, expectedUrl }) => {
      it(`fscRequest: ${fscRequest} fscRequestAgeInDays: ${fscRequestAgeInDays} should link ${expectedUrl}`, () => {
        if (fscRequest) {
          cy.task("addFscRequestId", {
            email,
            fscRequestId: "foo",
            createdAt: fscRequestAgeInDays
              ? new Date(
                  new Date().setDate(new Date().getDate() - fscRequestAgeInDays)
                )
              : new Date(),
          });
        }

        cy.login();
        cy.visit("/anmelden/erfolgreich");
        cy.contains("h1", "angemeldet");
        if (expectedUrl) {
          cy.contains("h2", "Freischaltcode beantragt");
          cy.get("[data-testid=continue-fsc]").click();
          cy.location("pathname").should("eq", expectedUrl);
        } else {
          cy.contains("h2", "Freischaltcode beantragt").should("not.exist");
          cy.get("[data-testid=continue-fsc]").should("not.exist");
        }
      });
    });
  });
});
export {};
