/// <reference types="../../cypress/support" />
import { GrundstueckMiteigentumAuswahlWohnungFields } from "app/domain/steps/grundstueck/miteigentum/miteigentumAuswahlWohnung.server";

describe("miteigentum", () => {
  beforeEach(() => {
    cy.login();
  });

  function selectMiteigentumWohnung(
    miteigentumTyp: GrundstueckMiteigentumAuswahlWohnungFields
  ) {
    const typ = miteigentumTyp.miteigentumTyp;
    cy.visit("/formular/grundstueck/typ");
    cy.url().should("include", "/formular/grundstueck/typ");
    cy.contains("legend", "welche Art");
    cy.get(`label[for=typ-wohnungseigentum]`).click();
    cy.get("#nextButton").click();
    cy.url().should("contain", "/adresse");
    cy.visit("/formular/grundstueck/miteigentumAuswahlWohnung");
    cy.url().should(
      "include",
      "/formular/grundstueck/miteigentumAuswahlWohnung"
    );
    cy.contains("legend", "Miteigentumsanteile");
    cy.get(`label[for=miteigentumTyp-${typ}]`).click();
    cy.get("#nextButton").click();
    if (typ === "none" || typ === "garage" || typ === "sondernutzung") {
      cy.url().should("include", "/formular/grundstueck/miteigentumWohnung");
      cy.contains(
        "h1",
        "Wie lautet der Miteigentumsanteil und die Nummer des Grundbuchblatts Ihrer Eigentumswohnung?"
      );
    }
  }

  it("should not display grundbuchblattnummer per flurstueck on miteigentum wohnung option none", () => {
    selectMiteigentumWohnung({ miteigentumTyp: "none" });
    cy.get("#wirtschaftlicheEinheitZaehler").clear().type("1");
    cy.get("#wirtschaftlicheEinheitNenner").clear().type("2");
    cy.get("#grundbuchblattnummer").clear().type("123");
    cy.get("#nextButton").click();

    cy.url().should("include", "/formular/grundstueck/anzahl");
    cy.get("#anzahl").select("1");
    cy.get("#nextButton").click();

    cy.url().should("include", "/formular/grundstueck/flurstueck/1/angaben");
    cy.get("#grundbuchblattnummer").should("not.exist");
  });

  it("should not display grundbuchblattnummer per flurstueck on miteigentum wohnung option garage", () => {
    selectMiteigentumWohnung({ miteigentumTyp: "garage" });

    cy.get("#wirtschaftlicheEinheitZaehler").clear().type("1");
    cy.get("#wirtschaftlicheEinheitNenner").clear().type("2");
    cy.get("#grundbuchblattnummer").clear().type("123");
    cy.get("#nextButton").click();

    cy.url().should("include", "/formular/grundstueck/miteigentumGarage");
    cy.contains(
      "h1",
      "Wie lautet der Miteigentumsanteil und die Nummer des Grundbuchblatts Ihres Garagenstellplatzes?"
    );
    cy.get("#wirtschaftlicheEinheitZaehler").clear().type("2");
    cy.get("#wirtschaftlicheEinheitNenner").clear().type("3");
    cy.get("#grundbuchblattnummer").clear().type("456");
    cy.get("#nextButton").click();

    cy.url().should("include", "/formular/grundstueck/anzahl");
    cy.get("#anzahl").select("1");
    cy.get("#nextButton").click();

    cy.url().should("include", "/formular/grundstueck/flurstueck/1/angaben");
    cy.get("#grundbuchblattnummer").should("not.exist");
  });

  it("should not display grundbuchblattnummer per flurstueck on miteigentum wohnung option sondernutzung", () => {
    selectMiteigentumWohnung({ miteigentumTyp: "sondernutzung" });
    cy.get("#wirtschaftlicheEinheitZaehler").clear().type("1");
    cy.get("#wirtschaftlicheEinheitNenner").clear().type("2");
    cy.get("#grundbuchblattnummer").clear().type("123");
    cy.get("#nextButton").click();

    cy.url().should("include", "/formular/grundstueck/anzahl");
    cy.get("#anzahl").select("1");
    cy.get("#nextButton").click();

    cy.url().should("include", "/formular/grundstueck/flurstueck/1/angaben");
    cy.get("#grundbuchblattnummer").should("not.exist");
  });

  it("should display grundbuchblattnummer per flurstueck on miteigentum wohnung option mixed", () => {
    selectMiteigentumWohnung({ miteigentumTyp: "mixed" });

    cy.url().should("include", "/formular/grundstueck/anzahl");
    cy.get("#anzahl").select("1");
    cy.get("#nextButton").click();

    cy.url().should("include", "/formular/grundstueck/flurstueck/1/angaben");
    cy.get("#grundbuchblattnummer").should("exist");
  });

  const cases = [
    "einfamilienhaus",
    "zweifamilienhaus",
    "baureif",
    "abweichendeEntwicklung",
  ];

  cases.forEach((typ) => {
    it(`should display grundbuchblattnummer per flurstueck for ${typ}`, () => {
      cy.visit("/formular/grundstueck/typ");
      cy.url().should("include", "/formular/grundstueck/typ");
      cy.contains("legend", "welche Art");
      cy.get(`label[for=typ-${typ}]`).click();
      cy.get("#nextButton").click();
      if (typ === "abweichendeEntwicklung") {
        cy.url().should(
          "contain",
          "/formular/grundstueck/abweichendeEntwicklung"
        );
      } else {
        cy.url().should("include", "/formular/grundstueck/adresse");
      }
      cy.visit("/formular/grundstueck/miteigentumAuswahlHaus");
      cy.url().should(
        "include",
        "/formular/grundstueck/miteigentumAuswahlHaus"
      );
      cy.contains("legend", "Miteigentumsanteile");
      cy.get(`label[for=hasMiteigentum-true]`).click();
      cy.get("#nextButton").click();

      cy.url().should("include", "/formular/grundstueck/anzahl");
      cy.get("#anzahl").select("1");
      cy.get("#nextButton").click();

      cy.url().should("include", "/formular/grundstueck/flurstueck/1/angaben");
      cy.get("#grundbuchblattnummer").should("exist");
    });
  });

  describe("for NRW", () => {
    beforeEach(() => {
      cy.bundesland("NW");
    });

    it("should require grundbuchblattnummer on grundstueck/miteigentumWohnung", () => {
      selectMiteigentumWohnung({ miteigentumTyp: "none" });

      cy.get("#wirtschaftlicheEinheitZaehler").clear().type("1");
      cy.get("#wirtschaftlicheEinheitNenner").clear().type("2");
      cy.get("#nextButton").click();

      cy.get("[data-testid=field-error]").should(
        "contain",
        "Für Grundstücke in Nordrhein-Westfalen muss immer ein Grundbuchblatt angegeben werden."
      );
    });

    it("should require grundbuchblattnummer on grundstueck/miteigentumGarage", () => {
      selectMiteigentumWohnung({ miteigentumTyp: "garage" });

      cy.get("#wirtschaftlicheEinheitZaehler").clear().type("1");
      cy.get("#wirtschaftlicheEinheitNenner").clear().type("2");
      cy.get("#grundbuchblattnummer").clear().type("123");
      cy.get("#nextButton").click();

      cy.url().should("include", "/formular/grundstueck/miteigentumGarage");
      cy.contains(
        "h1",
        "Wie lautet der Miteigentumsanteil und die Nummer des Grundbuchblatts Ihres Garagenstellplatzes?"
      );
      cy.get("#wirtschaftlicheEinheitZaehler").clear().type("2");
      cy.get("#wirtschaftlicheEinheitNenner").clear().type("3");
      cy.get("#nextButton").click();

      cy.get("[data-testid=field-error]").should(
        "contain",
        "Für Grundstücke in Nordrhein-Westfalen muss immer ein Grundbuchblatt angegeben werden."
      );
    });

    it("should require grundbuchblattnummer on flurstueck/x/angaben", () => {
      selectMiteigentumWohnung({ miteigentumTyp: "mixed" });

      cy.url().should("include", "/formular/grundstueck/anzahl");
      cy.get("#anzahl").select("1");
      cy.get("#nextButton").click();

      cy.url().should("include", "/formular/grundstueck/flurstueck/1/angaben");
      cy.get("#gemarkung").type("foo");
      cy.get("#nextButton").click();

      cy.get("[data-testid=field-error]").should(
        "contain",
        "Für Grundstücke in Nordrhein-Westfalen muss immer ein Grundbuchblatt angegeben werden."
      );
    });
  });
});

export {};
