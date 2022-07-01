/// <reference types="../../cypress/support" />
// @ts-checkdescribe("Boris pages", () => {
describe("Boris pags", () => {
  beforeEach(() => {
    cy.login();
  });
  const data = [
    {
      bundesland: "no Bundesland selected",
      key: undefined,
      infoTitle: "Ermitteln Sie den Bodenrichtwert für Ihr gesamtes Grundstück",
      infoBody: [
        "Einige Finanzverwaltungen schicken mit dem Informationsschreiben auch ein Datenstammblatt mit. Dort können Sie die Daten zu Ihrem Bodenrichtwert ablesen und auf der nächsten Seite eintragen. Haben Sie keinen Brief erhalten, folgen Sie bitte den Links für das jeweilige Bundesland.",
      ],
      portalLabel: undefined,
      eingabeDesc:
        "Den Wert konnten Sie dem Bodenrichtwert-Portal Ihres Bundeslandes entnehmen. Wenn noch nicht geschehen, nutzen Sie dafür den Link auf der Seite Bodenrichtwert-Info.",
    },
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
        "Klicken Sie auf den Link, der Sie zum Grundsteuerdaten-Portal Mecklenburg-Vorpommern führt.",
        "In diesem Grundsteuerdaten-Portal finden Sie noch weitere Angaben zu Gemarkung, Flurstück und Grundstücksgröße.",
      ],
      portalLabel: "Zum Grundsteuerdaten-Portal Mecklenburg-Vorpommern",
      eingabeDesc:
        "Den Wert haben Sie dem Grundsteuerdaten-Portal Mecklenburg-Vorpommern entnommen. Wenn noch nicht geschehen, nutzen Sie dafür den Link auf der Seite Bodenrichtwert-Info.",
    },
    {
      bundesland: "Nordrhein-Westfalen",
      key: "NW",
      infoTitle:
        "Ermitteln Sie weitere Angaben für die Eingaben auf den folgenden Seiten",
      infoBody: [
        "Sie haben kürzlich ein Informationsschreiben von Ihrer Landesfinanzverwaltung erhalten.",
        "Falls Ihnen der Brief nicht mehr vorliegt oder Sie zur Prüfung den Bodenrichtwert nachsehen wollen, klicken Sie auf den Link und geben Sie Ihre Grundstücksadresse auf der Seite des Bodenrichtwert-Portals Nordrhein-Westfalen ein.",
      ],
      portalLabel: "Zum Bodenrichtwert-Portal Nordrhein-Westfalen",
      eingabeDesc:
        "Den Wert finden Sie in der Tabelle der Anlage, die Sie kürzlich mit dem Informationsschreiben der Finanzverwaltung erhalten haben. Falls Ihnen dieses Datenblatt nicht mehr vorliegt, nutzen Sie dafür den Link auf der Seite Bodenrichtwert-Info.",
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
        "Klicken Sie auf den Link, der Sie zum Grundsteuerportal Schleswig-Holstein führt.",
        "In diesem Grundsteuerportal finden Sie noch weitere Angaben zu Gemarkung, Flurstück und Grundstücksgröße.",
      ],
      portalLabel: "Zum Grundsteuerportal Schleswig-Holstein",
      eingabeDesc:
        "Den Wert haben Sie dem Grundsteuerportal Schleswig-Holstein entnommen. Wenn noch nicht geschehen, nutzen Sie dafür den Link auf der Seite Bodenrichtwert-Info.",
    },
    {
      bundesland: "Saarland",
      key: "SL",
      infoTitle:
        "Ermitteln Sie weitere Angaben für die Eingaben auf den folgenden Seiten",
      infoBody: [
        "Sie haben kürzlich ein Informationsschreiben von Ihrer Landesfinanzverwaltung erhalten. Diesem ist ein Datenstammblatt beigelegt. Darin finden Sie alle Angaben zu Ihrem Grundstück.",
        "Falls Ihnen der Brief nicht mehr vorliegt",
      ],
      portalLabel: "Zum Grundsteuerviewer Saarland",
      eingabeDesc:
        "Den Wert finden Sie in der Tabelle des Datenstammblatts, das Sie kürzlich mit dem Informationsschreiben der Finanzverwaltung erhalten haben. Falls Ihnen das Datenblatt nicht mehr vorliegt, nutzen Sie dafür den Link auf der Seite Bodenrichtwert-Info.",
    },
    {
      bundesland: "Sachsen",
      key: "SN",
      infoTitle:
        "Ermitteln Sie weitere Angaben für die Eingaben auf den folgenden Seiten",
      infoBody: [
        "Klicken Sie auf den Link, der Sie zum Grundsteuerportal Sachsen führt. Geben Sie dort Ihre Grundstücksadresse ein. Auf einer Karte können Sie den Bodenrichtwert ablesen. Nutzen Sie bei Bedarf unsere Schritt-für-Schritt Anleitung weiter unten.",
        "In diesem Bodenrichtwert-Portal finden Sie noch weitere Angaben zu Gemeinde, Gemarkung und Flurstück.",
      ],
      portalLabel: "Zum Grundsteuerportal Sachsen",
      eingabeDesc:
        "Den Wert haben Sie dem Grundsteuerportal Sachsen entnommen. Wenn noch nicht geschehen, nutzen Sie dafür den Link auf der Seite Bodenrichtwert-Info.",
    },
    {
      bundesland: "Sachsen-Anhalt",
      key: "ST",
      infoTitle: "Ermitteln Sie den Bodenrichtwert für Ihr gesamtes Grundstück",
      infoBody: [
        "Den Bodenrichtwert für Ihr Grundstück finden Sie mithilfe des Grundsteuer-Viewers Sachsen-Anhalt.",
      ],
      portalLabel: "Zum Grundsteuer-Viewer Sachsen-Anhalt",
      eingabeDesc:
        "Den Wert haben Sie dem Grundsteuer-Viewer Sachsen-Anhalt entnommen. Wenn noch nicht geschehen, nutzen Sie dafür den Link auf der Seite Bodenrichtwert-Info.",
    },
    {
      bundesland: "Thüringen",
      key: "TH",
      infoTitle:
        "Ermitteln Sie weitere Angaben für die Eingaben auf den folgenden Seiten",
      infoBody: [
        "Klicken Sie auf den Link, der Sie zum Grundsteuer Viewer Thüringen führt.",
        "In diesem Grundsteuer Viewer finden Sie noch weitere Angaben zu Gemarkung, Flurstück und Grundstücksgröße.",
      ],
      portalLabel: "Zum Grundsteuer Viewer Thüringen",
      eingabeDesc:
        "Den Wert haben Sie dem Grundsteuer Viewer Thüringen entnommen. Wenn noch nicht geschehen, nutzen Sie dafür den Link auf der Seite Bodenrichtwert-Info.",
    },
  ];

  data.forEach(
    ({ bundesland, key, infoTitle, infoBody, portalLabel, eingabeDesc }) => {
      it(`should render correct text for ${bundesland}`, () => {
        if (key) {
          cy.bundesland(key);
          cy.wait(500);
        }
        cy.visit("/formular/grundstueck/bodenrichtwertInfo");
        cy.url().should("contain", "bodenrichtwertInfo");
        cy.contains("h1", infoTitle);
        for (const text of infoBody) {
          cy.contains(text);
        }
        if (key) {
          cy.contains(portalLabel);
        }
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
          "Die meisten Grundstücke liegen innerhalb einer Bodenrichtwertzone. Es kann aber vorkommen, dass sich diese überlagern. Wie verläuft die Bodenrichtwertgrenze für Ihr Grundstück? Herum oder hindurch? Vergleichen Sie dafür die Bildbeispiele."
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
