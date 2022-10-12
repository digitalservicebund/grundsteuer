/// <reference types="../../cypress/support" />
describe("miteigentum", () => {
  beforeEach(() => {
    cy.login();
  });

  it("should not display grundbuchblattnummer per flurstueck on miteigentum wohnung option 1", () => {
    cy.visit("/formular/grundstueck/typ");
    cy.get(`label[for=typ-wohnungseigentum]`).click();
    cy.get("#nextButton").click();
    cy.visit("/formular/grundstueck/miteigentumAuswahlWohnung");
    cy.get(`label[for=miteigentumTyp-none]`).click();
    cy.get("#nextButton").click();

    cy.url().should("include", "/formular/grundstueck/miteigentumWohnung");
    cy.contains(
      "h1",
      "Wie lautet der Miteigentumsanteil und die Nummer des Grundbuchblatts Ihrer Eigentumswohnung?"
    );
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

  it("should not display grundbuchblattnummer per flurstueck on miteigentum wohnung option 2", () => {
    cy.visit("/formular/grundstueck/typ");
    cy.get(`label[for=typ-wohnungseigentum]`).click();
    cy.get("#nextButton").click();
    cy.visit("/formular/grundstueck/miteigentumAuswahlWohnung");
    cy.get(`label[for=miteigentumTyp-garage]`).click();
    cy.get("#nextButton").click();

    cy.url().should("include", "/formular/grundstueck/miteigentumWohnung");
    cy.contains(
      "h1",
      "Wie lautet der Miteigentumsanteil und die Nummer des Grundbuchblatts Ihrer Eigentumswohnung?"
    );
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

  it("should display grundbuchblattnummer per flurstueck on miteigentum wohnung option 3", () => {
    cy.visit("/formular/grundstueck/typ");
    cy.get(`label[for=typ-wohnungseigentum]`).click();
    cy.get("#nextButton").click();
    cy.visit("/formular/grundstueck/miteigentumAuswahlWohnung");
    cy.get(`label[for=miteigentumTyp-mixed]`).click();
    cy.get("#nextButton").click();

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
      cy.get(`label[for=typ-${typ}]`).click();
      cy.get("#nextButton").click();
      cy.visit("/formular/grundstueck/miteigentumAuswahlHaus");
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
      cy.visit("/formular/grundstueck/typ");
      cy.get(`label[for=typ-wohnungseigentum]`).click();
      cy.get("#nextButton").click();
      cy.visit("/formular/grundstueck/miteigentumAuswahlWohnung");
      cy.get(`label[for=miteigentumTyp-none]`).click();
      cy.get("#nextButton").click();

      cy.url().should("include", "grundstueck/miteigentumWohnung");
      cy.contains(
        "h1",
        "Wie lautet der Miteigentumsanteil und die Nummer des Grundbuchblatts Ihrer Eigentumswohnung?"
      );
      cy.get("#wirtschaftlicheEinheitZaehler").clear().type("1");
      cy.get("#wirtschaftlicheEinheitNenner").clear().type("2");
      cy.get("#nextButton").click();

      cy.get("[data-testid=field-error]").should(
        "contain",
        "Für Grundstücke in Nordrhein-Westfalen muss immer ein Grundbuchblatt angegeben werden."
      );
    });

    it("should require grundbuchblattnummer on grundstueck/miteigentumGarage", () => {
      cy.visit("/formular/grundstueck/typ");
      cy.get(`label[for=typ-wohnungseigentum]`).click();
      cy.get("#nextButton").click();
      cy.visit("/formular/grundstueck/miteigentumAuswahlWohnung");
      cy.get(`label[for=miteigentumTyp-garage]`).click();
      cy.get("#nextButton").click();

      cy.url().should("include", "/formular/grundstueck/miteigentumWohnung");
      cy.contains(
        "h1",
        "Wie lautet der Miteigentumsanteil und die Nummer des Grundbuchblatts Ihrer Eigentumswohnung?"
      );
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
      cy.visit("/formular/grundstueck/typ");
      cy.get(`label[for=typ-wohnungseigentum]`).click();
      cy.get("#nextButton").click();
      cy.visit("/formular/grundstueck/miteigentumAuswahlWohnung");
      cy.get(`label[for=miteigentumTyp-mixed]`).click();
      cy.get("#nextButton").click();

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
