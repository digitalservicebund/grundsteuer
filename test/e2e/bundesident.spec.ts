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
    cy.contains(
      "h1",
      "Möchten Sie sich in wenigen Minuten mit Ihrem Ausweis identifizieren?"
    );
    cy.contains("Alle Identifikationsoptionen").click();
    cy.contains("h1", "Mit welcher Option möchten Sie sich identifizieren?");
  });

  it("should show bundesIdent desktop option on desktop", () => {
    cy.login();
    cy.visit("/identifikation", {
      headers: {
        "user-agent": desktopUserAgent,
      },
    });
    cy.contains(
      "h1",
      "Möchten Sie sich in wenigen Minuten mit Ihrem Ausweis identifizieren?"
    );
    cy.contains("Alle Identifikationsoptionen").click();
    cy.contains("h1", "Mit welcher Option möchten Sie sich identifizieren?");
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
    cy.contains("h1", "Voraussetzung für die Identifikation mit Ihrem Ausweis");
    cy.contains("Zurück").click();
    cy.contains(
      "h1",
      "Warum haben Sie sich gegen eine Identifikation mit dem Ausweis entschieden?"
    );
    cy.contains("div", "Überspringen").click();
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

    // THEN I see first destktop guide with 3 steps
    cy.contains(
      "h1",
      "Identifizieren Sie sich in wenigen Minuten mit Ihrem Ausweis"
    );
    cy.get(".enumerate-card").should("have.length", 3);
    cy.contains("a", "Weiter").click();

    // THEN I see second destktop guide with 2 steps
    cy.contains(
      "h1",
      "Wählen Sie wieder die Option »Identifikation mit Ausweis«"
    );
    cy.get(".enumerate-card").should("have.length", 2);
    cy.contains("a", "Weiter").click();

    // THEN I see third destktop guide with 3 steps
    cy.contains(
      "h1",
      "Installieren Sie BundesIdent und identifizieren Sie sich mit Ihrem Ausweis"
    );
    cy.get(".enumerate-card").should("have.length", 3);
    cy.contains("button", "Weiter").click();

    // THEN I see an error notification
    cy.url().should("include", "/bundesIdent/desktop");
    cy.contains("Identifikation nicht erfolgreich abgeschlossen");
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

    // THEN I see first destktop guide with 3 steps
    cy.contains(
      "h1",
      "Identifizieren Sie sich in wenigen Minuten mit Ihrem Ausweis"
    );
    cy.get(".enumerate-card").should("have.length", 3);
    cy.contains("a", "Weiter").click();

    // THEN I see second destktop guide with 2 steps
    cy.contains(
      "h1",
      "Wählen Sie wieder die Option »Identifikation mit Ausweis«"
    );
    cy.get(".enumerate-card").should("have.length", 2);
    cy.contains("a", "Weiter").click();

    // THEN I see third destktop guide with 3 steps
    cy.contains(
      "h1",
      "Installieren Sie BundesIdent und identifizieren Sie sich mit Ihrem Ausweis"
    );
    cy.get(".enumerate-card").should("have.length", 3);

    cy.task("setUserIdentified", {
      email: "foo@bar.com",
    });

    cy.contains("button", "Weiter").click();

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
