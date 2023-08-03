/// <reference types="../../cypress/support" />

describe("error banners", () => {
  beforeEach(() => {
    cy.task("dbResetUser", "foo@bar.com");
  });

  describe("ekona is down", () => {
    before(() => {
      cy.task("enableFlag", {
        name: "grundsteuer.ekona_down",
      });
      cy.wait(1000);
    });
    after(() => {
      cy.task("disableFlag", {
        name: "grundsteuer.ekona_down",
      });
    });

    const bannerId = "[data-testid=ekona-banner]";
    const buttonLabel = "ELSTER";

    it("should have no effect on home", () => {
      cy.visit("/");
      cy.get(bannerId).should("not.exist");
    });

    it("should show banner and disable button on /identifikation", () => {
      cy.login();
      cy.visit("/identifikation");

      cy.url().should("include", "/identifikation");
      cy.contains("h1", "Mit welcher Option möchten Sie sich identifizieren?");

      cy.get(bannerId).should("exist");
      cy.contains("button", buttonLabel).should("be.disabled");
    });

    it("should show banner and disable button on /ekona", () => {
      cy.login();
      cy.visit("/ekona");
      cy.url().should("include", "/ekona");

      cy.get(bannerId).should("exist");
      cy.contains("button", buttonLabel).should("be.disabled");
    });

    it("should have no effect on /fsc", () => {
      cy.login();
      cy.visit("/fsc");
      cy.url().should("include", "/fsc");
      cy.get(bannerId).should("not.exist");
    });

    it("should have no effect on /formular", () => {
      cy.login();
      cy.visit("/formular");
      cy.url().should("include", "/formular/welcome");
      cy.get(bannerId).should("not.exist");
    });

    it("should have no effect on /formular/zusammenfassung", () => {
      cy.login();
      cy.visit("/formular/zusammenfassung");
      cy.url().should("include", "/formular/zusammenfassung");
      cy.get(bannerId).should("not.exist");
    });
  });

  describe("erica is down", () => {
    before(() => {
      cy.task("enableFlag", {
        name: "grundsteuer.erica_down",
      });
      cy.wait(1000);
    });
    after(() => {
      cy.task("disableFlag", {
        name: "grundsteuer.erica_down",
      });
    });

    const bannerId = "[data-testid=erica-banner]";

    it("should have no effect on home", () => {
      cy.visit("/");
      cy.get(bannerId).should("not.exist");
    });

    it("should show banner and disable button on /identifikation", () => {
      cy.login();
      cy.visit("/identifikation");

      cy.url().should("include", "/identifikation");
      cy.contains("h1", "Mit welcher Option möchten Sie sich identifizieren?");

      cy.get(bannerId).should("exist");
      cy.contains("button", "Freischaltcode").should("be.disabled");
    });

    it("should have no effect on /ekona", () => {
      cy.login();
      cy.visit("/ekona");
      cy.url().should("include", "/ekona");

      cy.get(bannerId).should("not.exist");
      cy.contains("button", "ELSTER").should("be.enabled");
    });

    it("should show banner and disable button on /fsc/beantragen", () => {
      cy.login();
      cy.visit("/fsc/beantragen");
      cy.url().should("include", "/fsc/beantragen");
      cy.get(bannerId).should("exist");
      cy.contains("button", "Freischaltcode").should("be.disabled");
    });

    it("should show banner and disable button on /fsc/eingeben", () => {
      cy.task("addFscRequestId", {
        email: "foo@bar.com",
        fscRequestId: "foo",
        createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
      });
      cy.login();
      cy.visit("/fsc/eingeben");
      cy.url().should("include", "/fsc/eingeben");
      cy.get(bannerId).should("exist");
      cy.contains("button", "Freischaltcode").should("be.disabled");

      cy.task("dbResetUser", "foo@bar.com");
    });

    it("should have no effect on /formular", () => {
      cy.login();
      cy.visit("/formular");
      cy.url().should("include", "/formular/welcome");
      cy.get(bannerId).should("not.exist");
    });

    it("should show banner and disable button on /formular/zusammenfassung", () => {
      cy.login();
      cy.visit("/formular/zusammenfassung");
      cy.url().should("include", "/formular/zusammenfassung");
      cy.get(bannerId).should("exist");
      cy.contains("button", "abschicken").should("be.disabled");
    });
  });

  describe("bundesIdent is down", () => {
    const mobileUserAgent =
      "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Mobile Safari/537.36";

    before(() => {
      cy.task("enableFlag", {
        name: "grundsteuer.bundesident_down",
      });
      cy.wait(1000);
    });
    after(() => {
      cy.task("disableFlag", {
        name: "grundsteuer.bundesident_down",
      });
    });

    const bannerId = "[data-testid=bundesident-banner]";
    const buttonLabel = "Ausweis";

    it("should have no effect on home", () => {
      cy.visit("/", {
        headers: {
          "user-agent": mobileUserAgent,
        },
      });
      cy.get(bannerId).should("not.exist");
    });

    it("should have no effect on /ekona", () => {
      cy.login();
      cy.visit("/ekona", {
        headers: {
          "user-agent": mobileUserAgent,
        },
      });
      cy.url().should("include", "/ekona");

      cy.get(bannerId).should("not.exist");
      cy.contains("button", "ELSTER").should("be.enabled");
    });

    it("should show banner and disable button on /identifikation", () => {
      cy.login();
      cy.visit("/identifikation", {
        headers: {
          "user-agent": mobileUserAgent,
        },
      });
      cy.url().should("include", "/identifikation");

      cy.get(bannerId).should("exist");
      cy.contains("button", buttonLabel).should("be.disabled");
    });

    it("should show banner on /bundesIdent/voraussetzung", () => {
      cy.login();
      cy.visit("/bundesIdent/voraussetzung", {
        headers: {
          "user-agent": mobileUserAgent,
        },
      });
      cy.url().should("include", "/bundesIdent/voraussetzung");

      cy.get(bannerId).should("exist");
    });

    it("should have no effect on /fsc", () => {
      cy.login();
      cy.visit("/fsc", {
        headers: {
          "user-agent": mobileUserAgent,
        },
      });
      cy.url().should("include", "/fsc");
      cy.get(bannerId).should("not.exist");
    });

    it("should have no effect on /formular", () => {
      cy.login();
      cy.visit("/formular", {
        headers: {
          "user-agent": mobileUserAgent,
        },
      });
      cy.url().should("include", "/formular/welcome");
      cy.get(bannerId).should("not.exist");
    });

    it("should have no effect on /formular/zusammenfassung", () => {
      cy.login();
      cy.visit("/formular/zusammenfassung", {
        headers: {
          "user-agent": mobileUserAgent,
        },
      });
      cy.url().should("include", "/formular/zusammenfassung");
      cy.get(bannerId).should("not.exist");
    });
  });

  describe("grundsteuer is down", () => {
    before(() => {
      cy.task("enableFlag", {
        name: "grundsteuer.grundsteuer_down",
      });
      cy.wait(1000);
    });
    after(() => {
      cy.task("disableFlag", {
        name: "grundsteuer.grundsteuer_down",
      });
    });

    const bannerId = "[data-testid=grundsteuer-banner]";

    it("should show banner on home", () => {
      cy.visit("/");
      cy.get(bannerId).should("exist");
    });

    it("should have no effect on /identifikation", () => {
      cy.login();
      cy.visit("/identifikation");

      cy.url().should("include", "/identifikation");
      cy.contains("h1", "Mit welcher Option möchten Sie sich identifizieren?");

      cy.get(bannerId).should("not.exist");
    });

    it("should have no effect on /formular", () => {
      cy.login();
      cy.visit("/formular");
      cy.url().should("include", "/formular/welcome");
      cy.get(bannerId).should("not.exist");
    });

    it("should have no effect on /formular/zusammenfassung", () => {
      cy.login();
      cy.visit("/formular/zusammenfassung");
      cy.url().should("include", "/formular/zusammenfassung");
      cy.get(bannerId).should("not.exist");
    });
  });

  describe("sendinblue is down", () => {
    before(() => {
      cy.task("enableFlag", {
        name: "grundsteuer.sendinblue_down",
      });
      cy.wait(1000);
    });
    after(() => {
      cy.task("disableFlag", {
        name: "grundsteuer.sendinblue_down",
      });
    });

    const bannerId = "[data-testid=sendinblue-banner]";

    it("should show banner on home", () => {
      cy.visit("/");
      cy.get(bannerId).should("exist");
    });

    it("should have no effect on /identifikation", () => {
      cy.login();
      cy.visit("/identifikation");

      cy.url().should("include", "/identifikation");
      cy.contains("h1", "Mit welcher Option möchten Sie sich identifizieren?");

      cy.get(bannerId).should("not.exist");
    });

    it("should have no effect on /formular", () => {
      cy.login();
      cy.visit("/formular");
      cy.url().should("include", "/formular/welcome");
      cy.get(bannerId).should("not.exist");
    });

    it("should have no effect on /formular/zusammenfassung", () => {
      cy.login();
      cy.visit("/formular/zusammenfassung");
      cy.url().should("include", "/formular/zusammenfassung");
      cy.get(bannerId).should("not.exist");
    });
  });

  describe("zammad is down", () => {
    before(() => {
      cy.task("enableFlag", {
        name: "grundsteuer.zammad_down",
      });
      cy.wait(1000);
    });
    after(() => {
      cy.task("disableFlag", {
        name: "grundsteuer.zammad_down",
      });
    });

    const bannerId = "[data-testid=zammad-banner]";

    it("should show banner on home", () => {
      cy.visit("/");
      cy.get(bannerId).should("exist");
    });

    it("should show banner /identifikation", () => {
      cy.login();
      cy.visit("/identifikation");

      cy.url().should("include", "/identifikation");
      cy.contains("h1", "Mit welcher Option möchten Sie sich identifizieren?");

      cy.get(bannerId).should("exist");
    });

    it("should show banner on /formular", () => {
      cy.login();
      cy.visit("/formular");
      cy.url().should("include", "/formular/welcome");
      cy.get(bannerId).should("exist");
    });

    it("should show banner on /formular/zusammenfassung", () => {
      cy.login();
      cy.visit("/formular/zusammenfassung");
      cy.url().should("include", "/formular/zusammenfassung");
      cy.get(bannerId).should("exist");
    });
  });

  describe("grundsteuer is slow", () => {
    before(() => {
      cy.task("enableFlag", {
        name: "grundsteuer.grundsteuer_slow",
      });
      cy.wait(1000);
    });
    after(() => {
      cy.task("disableFlag", {
        name: "grundsteuer.grundsteuer_slow",
      });
    });

    const bannerId = "[data-testid=grundsteuer-slow-banner]";

    it("should show banner on home", () => {
      cy.visit("/");
      cy.get(bannerId).should("exist");
    });

    it("should show banner on /identifikation", () => {
      cy.login();
      cy.visit("/identifikation");

      cy.url().should("include", "/identifikation");
      cy.contains("h1", "Mit welcher Option möchten Sie sich identifizieren?");

      cy.get(bannerId).should("exist");
    });

    it("should show banner on /formular", () => {
      cy.login();
      cy.visit("/formular");
      cy.url().should("include", "/formular/welcome");
      cy.get(bannerId).should("exist");
    });

    it("should show banner on /formular/zusammenfassung", () => {
      cy.login();
      cy.visit("/formular/zusammenfassung");
      cy.url().should("include", "/formular/zusammenfassung");
      cy.get(bannerId).should("exist");
    });
  });
});

describe("Deadline banner", () => {
  const paths = [
    "/",
    "/anmelden/erfolgreich",
    "/identifikation",
    "/fsc/beantragen",
    "/ekona",
    "/formular/welcome",
    "/formular/zusammenfassung",
  ];

  const screenWidths = [400, 1400];

  screenWidths.forEach((width) => {
    paths.forEach((path) => {
      it(`should appear on ${path} with screen width ${width}`, () => {
        cy.viewport(width, 1000);
        if (!(path == "/")) {
          cy.login();
        }
        cy.visit(path);
        cy.url().should("include", path);

        cy.get("[data-testid=deadline-banner]").should("exist");
      });
    });
  });

  const noAppearPaths = ["/404", "/anmelden", "/bundesIdent", "/registrieren"];

  noAppearPaths.forEach((path) => {
    it(`should not appear on ${path}`, () => {
      if (!path.includes("anmelden") && !path.includes("registrieren")) {
        cy.login();
      }
      cy.visit(path, { failOnStatusCode: false });

      cy.url().should("include", path);

      cy.get("[data-testid=deadline-banner]").should("not.exist");
    });
  });
});

export {};
