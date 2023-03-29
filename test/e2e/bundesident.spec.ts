/// <reference types="../../cypress/support" />
const mobileUserAgent =
  "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Mobile Safari/537.36";
const desktopUserAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36";

describe("Identifikation option", () => {
  before(() => {
    cy.task("dbResetUser", "foo@bar.com");
  });

  beforeEach(() => {
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

  it("should show bundesIdent desktop option on desktop", () => {
    cy.login();
    cy.visit("/identifikation", {
      headers: {
        "user-agent": desktopUserAgent,
      },
    });
    cy.contains("dt", "Identifikation mit Ihrem Ausweis über Ihr Smartphone");
  });
});

describe("bundesIdent flow", () => {
  before(() => {
    cy.task("dbResetUser", "foo@bar.com");
  });

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
    cy.contains("a", "Zurück").click();
    cy.contains("a", "Überspringen").click();
    cy.contains("h1", "Mit welcher Option möchten Sie sich identifizieren?");
  });
});

describe("bundesIdent desktop flow", () => {
  before(() => {
    cy.task("dbResetUser", "foo@bar.com");
  });

  beforeEach(() => {
    cy.task("setUserUnidentified", {
      email: "foo@bar.com",
    });
  });

  it("should go to correct pages on desktop if user not identified in process", () => {
    cy.login();
    cy.visit("/identifikation", {
      headers: {
        "user-agent": desktopUserAgent,
      },
    });
    cy.contains("a", "Identifikation mit Ausweis").click();
    cy.contains("h1", "Voraussetzung für die Identifikation mit Ihrem Ausweis");
    cy.url().should("include", "/bundesIdent/voraussetzung");

    cy.contains("div", "Verstanden & weiter").click();

    cy.contains("button", "Identifikation abgeschlossen").click();
    cy.url().should("include", "/bundesIdent/desktop");
    cy.contains("Identifikation nicht abgeschlossen");
  });

  it("should go to correct pages on desktop if user identified in process", () => {
    cy.login();
    cy.visit("/identifikation", {
      headers: {
        "user-agent": desktopUserAgent,
      },
    });
    cy.contains("a", "Identifikation mit Ausweis").click();
    cy.contains("h1", "Voraussetzung für die Identifikation mit Ihrem Ausweis");
    cy.contains("a", "Verstanden & weiter").click();

    cy.url().should("include", "/bundesIdent/desktop");

    cy.task("setUserIdentified", {
      email: "foo@bar.com",
    });
    cy.contains("button", "Identifikation abgeschlossen").click();

    cy.url().should("include", "/bundesIdent/erfolgreich");
    cy.contains("li", "Identifikation abgeschlossen & Seite neu laden");
  });
});

describe("with kill switch enabled", () => {
  before(() => {
    cy.task("dbResetUser", "foo@bar.com");
    cy.task("enableFlag", {
      name: "grundsteuer.bundesident_disabled",
    });
    cy.wait(1000);
  });
  after(() => {
    cy.task("disableFlag", {
      name: "grundsteuer.bundesident_disabled",
    });
  });

  it("should not show bundesIdent option on /identifikation", () => {
    cy.login();
    cy.visit("/identifikation", {
      headers: {
        "user-agent": mobileUserAgent,
      },
    });
    cy.contains("dt", "Identifikation mit Ihrem Ausweis").should("not.exist");
  });

  it("should redirect to identifikation on /bundesIdent", () => {
    cy.login();
    cy.visit("/bundesIdent", {
      headers: {
        "user-agent": mobileUserAgent,
      },
    });
    cy.url().should("include", "/identifikation");
  });
});

export {};
