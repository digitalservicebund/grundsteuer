/// <reference types="../../cypress/support" />
const mobileUserAgent =
  "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Mobile Safari/537.36";
const desktopUserAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36";

describe("Identifikation option", () => {
  beforeEach(() => {
    Cypress.config().userAgent = mobileUserAgent;
    cy.task("setUserUnidentified", {
      email: "foo@bar.com",
    });
  });

  it("should show bundesIdent option on mobile", () => {
    cy.login();
    cy.visit("/identifikation", {
      headers: {
        "user-agent": mobileUserAgent,
      },
    });
    cy.contains("dt", "Identifikation mit Ihrem Ausweis");
  });

  it("should not show bundesIdent option on desktop", () => {
    cy.login();
    cy.visit("/identifikation", {
      headers: {
        "user-agent": desktopUserAgent,
      },
    });
    cy.contains("dt", "Identifikation mit Ihrem Ausweis").should("not.exist");
  });
});

describe("bundesIdent flow", () => {
  beforeEach(() => {
    cy.task("setUserUnidentified", {
      email: "foo@bar.com",
    });
  });

  it("should go to correct pages on mobile", () => {
    cy.login();
    cy.visit("/identifikation", {
      headers: {
        "user-agent": mobileUserAgent,
      },
    });
    cy.contains("a", "Identifikation mit Ausweis").click();
    cy.contains("h1", "Voraussetzung für die Identifikation mit Ihrem Ausweis");
    cy.contains("a", "Verstanden & weiter").click();
    cy.url().should("include", "/bundesIdent");
    cy.visit("/bundesIdent", {
      headers: {
        "user-agent": mobileUserAgent,
      },
    });
    cy.contains(
      "h1",
      "Identifizieren Sie sich mit Ihrem Ausweis und der BundesIdent App"
    );
    cy.contains("a", "Zurück zur Voraussetzung").click();
    cy.contains("a", "Zurück zu Identifikationsoptionen").click();
    cy.contains("h1", "Mit welcher Option möchten Sie sich identifizieren?");
  });
});

export {};
