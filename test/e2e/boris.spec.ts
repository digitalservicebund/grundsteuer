/// <reference types="../../cypress/support" />
// @ts-checkdescribe("Boris pages", () => {
describe("Boris pags", () => {
  beforeEach(() => {
    cy.login();
  });
  const data = [
    {
      bundesland: "Brandenburg",
      key: "BB",
      infoTitle:
        "Ermitteln Sie weitere Angaben für die Eingaben auf den folgenden Seiten",
      infoDesc:
        "Klicken Sie auf den Link, der Sie zum Informationsportal Grundstücksdaten Brandenburg führt.",
      portalLabel: "Zum Informationsportal Grundstücksdaten Brandenburg",
      anzahlDesc:
        "Die meisten Grundstücke haben nur einen Bodenrichtwert. Es kann aber vorkommen, das sich Bodenrichtwertzonen überlagern. Sieht Ihr Grundstück auf der Karte so aus wie im zweiten Bildbeispiel, wählen Sie bitte “zwei Bodenrichwerte” aus.",
      eingabeDesc:
        "Den Wert haben Sie dem Informationsportal Grundstücksdaten entnommen. Wenn noch nicht geschehen, nutzen Sie dafür den Link auf der Seite Bodenrichtwert-Info.",
    },
    {
      bundesland: "Berlin",
      key: "BE",
      infoTitle: "Ermitteln Sie den Bodenrichtwert für Ihr Grundstück",
      infoDesc: "Ihre Grundstücksadresse im Bodenrichtwert-Portal Berlin",
      portalLabel: "Zum Bodenrichtwert-Portal Berlin",
      anzahlDesc:
        "Die meisten Grundstücke haben nur einen Bodenrichtwert. Es kann aber vorkommen, das sich Bodenrichtwertzonen überlagern. Sieht Ihr Grundstück auf der Karte so aus wie im zweiten Bildbeispiel, wählen Sie bitte “zwei Bodenrichwerte” aus.",
      eingabeDesc:
        "Den Wert haben Sie dem Bodenrichtwert-Portal Berlin entnommen. Wenn noch nicht geschehen, nutzen Sie dafür den Link auf der Seite Bodenrichtwert-Info.",
    },
    {
      bundesland: "Bremen",
      key: "HB",
      infoTitle:
        "Ermitteln Sie weitere Angaben für die Eingaben auf den folgenden Seiten",
      infoDesc:
        "mithilfe des Bodenrichtwert-Portals für Bremen und Niedersachsen",
      portalLabel: "Zum Bodenrichtwert-Portal Bremen und Niedersachsen",
      anzahlDesc:
        "Die meisten Grundstücke haben nur einen Bodenrichtwert. Es kann aber vorkommen, das sich Bodenrichtwertzonen überlagern. Sieht Ihr Grundstück auf der Karte so aus wie im zweiten Bildbeispiel, wählen Sie bitte “zwei Bodenrichwerte” aus.",
      eingabeDesc:
        "Den Wert haben Sie dem Bodenrichtwert-Portal Bremen und Niedersachsen entnommen. Wenn noch nicht geschehen, nutzen Sie dafür den Link auf der Seite Bodenrichtwert-Info.",
    },
    {
      bundesland: "Mecklenburg-Vorpommern",
      key: "MV",
      infoTitle:
        "Ermitteln Sie weitere Angaben für die Eingaben auf den folgenden Seiten",
      infoDesc:
        "Klicken Sie auf den Link, der Sie zum Bodenrichtwert-Portal Mecklenburg-Vorpommern führt.",
      portalLabel: "Zum Bodenrichtwert-Portal Mecklenburg-Vorpommern",
      anzahlDesc:
        "Die meisten Grundstücke haben nur einen Bodenrichtwert. Es kann aber vorkommen, das sich Bodenrichtwertzonen überlagern. Sieht Ihr Grundstück auf der Karte so aus wie im zweiten Bildbeispiel, wählen Sie bitte “zwei Bodenrichwerte” aus.",
      eingabeDesc:
        "Den Wert haben Sie dem Bodenrichtwert-Portal Mecklenburg-Vorpommern entnommen. Wenn noch nicht geschehen, nutzen Sie dafür den Link auf der Seite Bodenrichtwert-Info.",
    },
    {
      bundesland: "Rheinland-Pfalz",
      key: "RP",
      infoTitle:
        "Ermitteln Sie weitere Angaben für die Eingaben auf den folgenden Seiten",
      infoDesc:
        "Sie haben kürzlich ein Informationsschreiben von Ihrer Landesfinanzverwaltung erhalten",
      portalLabel: "Zum Bodenrichtwert-Portal Rheinland-Pfalz",
      anzahlDesc:
        "Die meisten Grundstücke haben nur einen Bodenrichtwert. Es kann aber vorkommen, das sich Bodenrichtwertzonen überlagern. Sieht Ihr Grundstück auf der Karte so aus wie im zweiten Bildbeispiel, wählen Sie bitte “zwei Bodenrichwerte” aus.",
      eingabeDesc:
        "Den Wert finden Sie in der Tabelle des Datenstammblatts, das Sie kürzlich mit dem Informationsschreiben der Finanzverwaltung erhalten haben. Falls Ihnen das Datenblatt nicht mehr vorliegt, nutzen Sie dafür den Link auf der Seite Bodenrichtwert-Info.",
    },
  ];

  data.forEach(
    ({
      bundesland,
      key,
      infoTitle,
      infoDesc,
      portalLabel,
      anzahlDesc,
      eingabeDesc,
    }) => {
      it(`should render correct text for ${bundesland}`, () => {
        cy.bundesland(key);
        cy.visit("/formular/grundstueck/bodenrichtwertInfo");
        cy.url().should("contain", "bodenrichtwertInfo");
        cy.contains("h1", infoTitle);
        cy.contains(infoDesc);
        cy.contains(portalLabel);
        cy.get("#nextButton").click();

        cy.url().should(
          "include",
          "/formular/grundstueck/bodenrichtwertAnzahl"
        );
        cy.contains(anzahlDesc);
        cy.get("label[for=anzahl-1]").click();
        cy.get("#nextButton").click();

        cy.url().should(
          "include",
          "/formular/grundstueck/bodenrichtwertEingabe"
        );
        cy.contains(eingabeDesc);
      });
    }
  );
});

export {};