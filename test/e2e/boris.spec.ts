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
      infoBody: [
        "Klicken Sie auf den Link, der Sie zum Informationsportal Grundstücksdaten Brandenburg führt.",
      ],
      portalLabel: "Zum Informationsportal Grundstücksdaten Brandenburg",
      eingabeDesc:
        "Den Wert haben Sie dem Informationsportal Grundstücksdaten entnommen. Wenn noch nicht geschehen, nutzen Sie dafür den Link auf der Seite Bodenrichtwert-Info.",
    },
    {
      bundesland: "Berlin",
      key: "BE",
      infoTitle: "Ermitteln Sie den Bodenrichtwert für Ihr Grundstück",
      infoBody: ["Ihre Grundstücksadresse im Bodenrichtwert-Portal Berlin"],
      portalLabel: "Zum Bodenrichtwert-Portal Berlin",
      eingabeDesc:
        "Den Wert haben Sie dem Bodenrichtwert-Portal Berlin entnommen. Wenn noch nicht geschehen, nutzen Sie dafür den Link auf der Seite Bodenrichtwert-Info.",
    },
    {
      bundesland: "Bremen",
      key: "HB",
      infoTitle:
        "Ermitteln Sie weitere Angaben für die Eingaben auf den folgenden Seiten",
      infoBody: [
        "mithilfe des Bodenrichtwert-Portals für Bremen und Niedersachsen",
        "Im Flurstücksviewer Bremen finden Sie weitere Angaben zu Gemarkung, Flur, Flurstück und Grundstücksgröße Ihres Grundstücks.",
      ],
      portalLabel: "Zum Bodenrichtwert-Portal Bremen und Niedersachsen",
      eingabeDesc:
        "Den Wert haben Sie dem Bodenrichtwert-Portal Bremen und Niedersachsen entnommen. Wenn noch nicht geschehen, nutzen Sie dafür den Link auf der Seite Bodenrichtwert-Info.",
    },
    {
      bundesland: "Mecklenburg-Vorpommern",
      key: "MV",
      infoTitle:
        "Ermitteln Sie weitere Angaben für die Eingaben auf den folgenden Seiten",
      infoBody: [
        "Klicken Sie auf den Link, der Sie zum Bodenrichtwert-Portal Mecklenburg-Vorpommern führt.",
        "In diesem Bodenrichtwert-Portal finden Sie noch weitere Angaben zu Gemarkung, Flurstück und Grundstücksgröße.",
      ],
      portalLabel: "Zum Bodenrichtwert-Portal Mecklenburg-Vorpommern",
      eingabeDesc:
        "Den Wert haben Sie dem Bodenrichtwert-Portal Mecklenburg-Vorpommern entnommen. Wenn noch nicht geschehen, nutzen Sie dafür den Link auf der Seite Bodenrichtwert-Info.",
    },
    {
      bundesland: "Rheinland-Pfalz",
      key: "RP",
      infoTitle:
        "Ermitteln Sie weitere Angaben für die Eingaben auf den folgenden Seiten",
      infoBody: [
        "Sie haben kürzlich ein Informationsschreiben von Ihrer Landesfinanzverwaltung erhalten",
        "Falls Ihnen der Brief nicht mehr vorliegt oder Sie zur Prüfung den Bodenrichtwert nachsehen wollen",
      ],
      portalLabel: "Zum Bodenrichtwert-Portal Rheinland-Pfalz",
      eingabeDesc:
        "Den Wert finden Sie in der Tabelle des Datenstammblatts, das Sie kürzlich mit dem Informationsschreiben der Finanzverwaltung erhalten haben. Falls Ihnen das Datenblatt nicht mehr vorliegt, nutzen Sie dafür den Link auf der Seite Bodenrichtwert-Info.",
    },
    {
      bundesland: "Schleswig-Holstein",
      key: "SH",
      infoTitle:
        "Ermitteln Sie weitere Angaben für die Eingaben auf den folgenden Seiten",
      infoBody: [
        "Klicken Sie auf den Link, der Sie zum Bodenrichtwert-Portal Schleswig-Holstein führt.",
        "In diesem Bodenrichtwert-Portal finden Sie noch weitere Angaben zu Gemarkung, Flurstück und Grundstücksgröße.",
      ],
      portalLabel: "Zum Bodenrichtwert-Portal Schleswig-Holstein",
      eingabeDesc:
        "Den Wert haben Sie dem Bodenrichtwert-Portal Schleswig-Holstein entnommen. Wenn noch nicht geschehen, nutzen Sie dafür den Link auf der Seite Bodenrichtwert-Info.",
    },
  ];

  data.forEach(
    ({ bundesland, key, infoTitle, infoBody, portalLabel, eingabeDesc }) => {
      it(`should render correct text for ${bundesland}`, () => {
        cy.bundesland(key);
        cy.wait(500);
        cy.visit("/formular/grundstueck/bodenrichtwertInfo");
        cy.url().should("contain", "bodenrichtwertInfo");
        cy.contains("h1", infoTitle);
        for (const text of infoBody) {
          cy.contains(text);
        }
        cy.contains(portalLabel);
        cy.get("#nextButton").click();

        cy.url().should(
          "include",
          "/formular/grundstueck/bodenrichtwertAnzahl"
        );
        cy.contains(
          "legend",
          "Verläuft durch Ihr Grundstück eine Bodenrichtwertgrenze?"
        );
        cy.contains(
          "Die meisten Grundstücke liegen innerhalb einer Bodenrichtwertzone. Es kann aber vorkommen, das sich diese überlagern. Wie verläuft die Bodenrichtwertgrenze für Ihr Grundstück? Herum oder hindurch? Vergleichen Sie dafür die Bildbeispiele."
        );
        cy.get("label[for=anzahl-1]")
          .contains(
            "Nein, das Grundstück liegt innerhalb einer Bodenrichtwertzone"
          )
          .click();
        cy.get("label[for=anzahl-2").contains(
          "Ja, eine Bodenrichtwertgrenze teilt das Grundstück"
        );
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
