/// <reference types="../../cypress/support" />

const inputData = {
  grundstueck: {
    adresse: {
      strasse: "Hauptstraße",
      hausnummer: "24b",
      zusatzangaben: "2. OG re.",
      plz: "01001",
      ort: "Au",
      bundesland: "BE",
    },
    steuernummer: {
      steuernummer: "13/898/89074",
    },
    bebaut: {
      bebaut: "bebaut",
    },
    haustyp: {
      haustyp: "wohnungseigentum",
    },
    gemeinde: {
      innerhalbEinerGemeinde: "true",
    },
    anzahl: {
      anzahl: "2",
    },
    flurstueck: {
      angaben: {
        grundbuchblattnummer: "123",
        gemarkung: "Schöneberg",
      },
      flur: {
        flur: "456",
        flurstueckZaehler: "2345",
        flurstueckNenner: "9876",
      },
      groesse: {
        groesseHa: "1",
        groesseA: "2",
        groesseQm: "30",
      },
    },
    bodenrichtwert: {
      bodenrichtwert: "200",
    },
    miteigentumAuswahlWohnung: {
      miteigentumTyp: "none",
    },
    miteigentumsanteilWohnung: {
      wirtschaftlicheEinheitZaehler: "1",
      wirtschaftlicheEinheitNenner: "234",
      grundbuchblattnummer: "654",
    },
  },
  gebaeude: {
    ab1949: {
      isAb1949: "true",
    },
    baujahr: {
      baujahr: "1970",
    },
    kernsaniert: {
      isKernsaniert: "true",
    },
    kernsanierungsjahr: {
      kernsanierungsjahr: "2002",
    },
    abbruchverpflichtung: {
      hasAbbruchverpflichtung: "true",
    },
    abbruchverpflichtungsjahr: {
      abbruchverpflichtungsjahr: "2030",
    },
    wohnflaeche: {
      wohnflaeche: "24",
    },
    weitereWohnraeume: {
      hasWeitereWohnraeume: "true",
    },
    weitereWohnraeumeDetails: {
      anzahl: "2",
      flaeche: "42",
    },
    garagen: {
      hasGaragen: "true",
    },
    garagenAnzahl: {
      anzahlGaragen: "1",
    },
  },
  eigentuemer: {
    anzahl: {
      anzahl: "2",
    },
    verheiratet: {
      areVerheiratet: "",
    },
    person1: {
      angaben: {
        anrede: "frau",
        titel: "Dr.",
        name: "Drew",
        vorname: "Nancy",
        geburtsdatum: "10.11.2000",
      },
      adresse: {
        strasse: "Baker St.",
        hausnummer: "221b",
        postfach: "",
        plz: "12345",
        ort: "London",
        telefonnummer: "555-2368",
      },
      gesetzlicherVertreter: {
        hasVertreter: "true",
      },
      vertreter: {
        name: {
          anrede: "herr",
          titel: "Prof Dr",
          name: "Mustermann",
          vorname: "Max",
        },
        adresse: {
          strasse: "Vertreterstr.",
          hausnummer: "42",
          postfach: "",
          plz: "54321",
          ort: "Manchester",
          telefonnummer: "123-321",
        },
      },
      anteil: {
        zaehler: "1",
        nenner: "2",
      },
    },
    person2: {
      angaben: {
        anrede: "no_anrede",
        titel: "Buccaneer",
        name: "Threepwood",
        vorname: "Guybrush",
        geburtsdatum: "01.10.1990",
      },
      adresse: {
        strasse: "Privet Drive",
        hausnummer: "4",
        postfach: "",
        plz: "01234",
        ort: "Little Whinging",
        telefonnummer: "089-32168",
      },
      steuerId: {
        steuerId: "02293417683",
      },
      gesetzlicherVertreter: {
        hasVertreter: "false",
      },
      anteil: {
        zaehler: "1",
        nenner: "2",
      },
    },
    empfangsbevollmaechtigter: {
      name: {
        anrede: "frau",
        name: "Organa",
        vorname: "Leia",
      },
      adresse: {
        strasse: "Skywalkerstr.",
        hausnummer: "35",
        postfach: "",
        plz: "34567",
        ort: "Alderaan",
        telefonnummer: "456-789",
      },
    },
  },
  freitext: "Ich fand die Plattform ganz toll.",
};

export const submitBtnSelector = "#nextButton";

describe("Happy Path", () => {
  beforeEach(() => {
    cy.task("setUserIdentified", {
      email: "foo@bar.com",
    });
    cy.request("GET", Cypress.env("ERICA_URL") + "/reset");
    cy.request("GET", Cypress.env("ERICA_URL") + "/triggerSuccess");
    cy.request("GET", Cypress.env("ERICA_URL") + "/triggerDirectResponse");
  });

  it("Enter data for two eigentuemer", () => {
    cy.login();
    cy.visit("/formular/welcome");
    cy.get(submitBtnSelector).click();
    cy.contains("h1", "Grundstück");
    cy.get(submitBtnSelector).click();

    cy.url().should("include", "/formular/grundstueck/bebaut");
    cy.get(`label[for=bebaut-${inputData.grundstueck.bebaut.bebaut}]`).click();
    cy.get(submitBtnSelector).click();

    cy.url().should("include", "/formular/grundstueck/haustyp");
    cy.get(
      `label[for=haustyp-${inputData.grundstueck.haustyp.haustyp}]`
    ).click();
    cy.get(submitBtnSelector).click();

    cy.contains("h1", "Geben Sie die Adresse Ihres Grundstücks ein");
    cy.get("#strasse").clear().type(inputData.grundstueck.adresse.strasse);
    cy.get("#hausnummer")
      .clear()
      .type(inputData.grundstueck.adresse.hausnummer);
    cy.get("#zusatzangaben")
      .clear()
      .type(inputData.grundstueck.adresse.zusatzangaben);
    cy.get("#plz").clear().type(inputData.grundstueck.adresse.plz);
    cy.get("#ort").clear().type(inputData.grundstueck.adresse.ort);
    cy.get("#bundesland").select(inputData.grundstueck.adresse.bundesland);
    cy.get(submitBtnSelector).click();

    cy.url().should("include", "/formular/grundstueck/steuernummer");
    cy.get("#steuernummer")
      .clear()
      .type(inputData.grundstueck.steuernummer.steuernummer);
    cy.get(submitBtnSelector).click();

    cy.url().should("include", "/formular/grundstueck/gemeinde");
    cy.get(
      `label[for=innerhalbEinerGemeinde-${inputData.grundstueck.gemeinde.innerhalbEinerGemeinde}]`
    ).click();
    cy.get(submitBtnSelector).click();

    cy.url().should("include", "/formular/grundstueck/bodenrichtwertInfo");
    cy.contains("h1", "Bodenrichtwert");
    cy.get(submitBtnSelector).click();
    cy.url().should("include", "/formular/grundstueck/bodenrichtwertAnzahl");
    cy.get("label[for=anzahl-1]").click();
    cy.get(submitBtnSelector).click();
    cy.contains("h1", "Geben Sie den Bodenrichtwert");
    cy.url().should("include", "/formular/grundstueck/bodenrichtwertEingabe");
    cy.get("#bodenrichtwert")
      .clear()
      .type(inputData.grundstueck.bodenrichtwert.bodenrichtwert);
    cy.get(submitBtnSelector).click();

    cy.url().should(
      "include",
      "/formular/grundstueck/miteigentumAuswahlWohnung"
    );
    cy.get(
      `label[for=miteigentumTyp-${inputData.grundstueck.miteigentumAuswahlWohnung.miteigentumTyp}]`
    ).click();
    cy.get(submitBtnSelector).click();

    cy.url().should("include", "/formular/grundstueck/miteigentumWohnung");
    cy.get("#wirtschaftlicheEinheitZaehler")
      .clear()
      .type(
        inputData.grundstueck.miteigentumsanteilWohnung
          .wirtschaftlicheEinheitZaehler
      );
    cy.get("#wirtschaftlicheEinheitNenner")
      .clear()
      .type(
        inputData.grundstueck.miteigentumsanteilWohnung
          .wirtschaftlicheEinheitNenner
      );
    cy.get("#grundbuchblattnummer")
      .clear()
      .type(
        inputData.grundstueck.miteigentumsanteilWohnung.grundbuchblattnummer
      );
    cy.get(submitBtnSelector).click();

    cy.url().should("include", "/formular/grundstueck/anzahl");
    cy.get("#anzahl").select(inputData.grundstueck.anzahl.anzahl);
    cy.get(submitBtnSelector).click();

    cy.url().should("include", "/formular/grundstueck/flurstueck/1/angaben");
    cy.get("#gemarkung")
      .clear()
      .type(inputData.grundstueck.flurstueck.angaben.gemarkung);
    cy.get(submitBtnSelector).click();

    cy.url().should("include", "/formular/grundstueck/flurstueck/1/flur");
    cy.get("#flur").clear().type(inputData.grundstueck.flurstueck.flur.flur);
    cy.get("#flurstueckZaehler")
      .clear()
      .type(inputData.grundstueck.flurstueck.flur.flurstueckZaehler);
    cy.get("#flurstueckNenner")
      .clear()
      .type(inputData.grundstueck.flurstueck.flur.flurstueckNenner);
    cy.get(submitBtnSelector).click();

    cy.url().should("include", "/formular/grundstueck/flurstueck/1/groesse");
    cy.get("#groesseHa")
      .clear()
      .type(inputData.grundstueck.flurstueck.groesse.groesseHa);
    cy.get("#groesseA")
      .clear()
      .type(inputData.grundstueck.flurstueck.groesse.groesseA);
    cy.get("#groesseQm")
      .clear()
      .type(inputData.grundstueck.flurstueck.groesse.groesseQm);
    cy.get(submitBtnSelector).click();

    cy.url().should("include", "/formular/grundstueck/flurstueck/2/angaben");
    cy.get("#gemarkung")
      .clear()
      .type(inputData.grundstueck.flurstueck.angaben.gemarkung);
    cy.get(submitBtnSelector).click();

    cy.url().should("include", "/formular/grundstueck/flurstueck/2/flur");
    cy.get("#flur").clear().type(inputData.grundstueck.flurstueck.flur.flur);
    cy.get("#flurstueckZaehler")
      .clear()
      .type(inputData.grundstueck.flurstueck.flur.flurstueckZaehler);
    cy.get("#flurstueckNenner")
      .clear()
      .type(inputData.grundstueck.flurstueck.flur.flurstueckNenner);
    cy.get(submitBtnSelector).click();

    cy.url().should("include", "/formular/grundstueck/flurstueck/2/groesse");
    cy.get("#groesseHa")
      .clear()
      .type(inputData.grundstueck.flurstueck.groesse.groesseHa);
    cy.get("#groesseA")
      .clear()
      .type(inputData.grundstueck.flurstueck.groesse.groesseA);
    cy.get("#groesseQm")
      .clear()
      .type(inputData.grundstueck.flurstueck.groesse.groesseQm);
    cy.get(submitBtnSelector).click();

    cy.url().should("include", "/formular/gebaeude/uebersicht");
    cy.contains("h1", "Gebäude");
    cy.get(submitBtnSelector).click();
    cy.get(`label[for=isAb1949-${inputData.gebaeude.ab1949.isAb1949}]`).click();
    cy.get(submitBtnSelector).click();
    cy.get("#baujahr").clear().type(inputData.gebaeude.baujahr.baujahr);
    cy.get(submitBtnSelector).click();
    cy.get(
      `label[for=isKernsaniert-${inputData.gebaeude.kernsaniert.isKernsaniert}]`
    ).click();
    cy.get(submitBtnSelector).click();
    cy.get("#kernsanierungsjahr")
      .clear()
      .type(inputData.gebaeude.kernsanierungsjahr.kernsanierungsjahr);
    cy.get(submitBtnSelector).click();
    cy.get(
      `label[for=hasAbbruchverpflichtung-${inputData.gebaeude.abbruchverpflichtung.hasAbbruchverpflichtung}]`
    ).click();
    cy.get(submitBtnSelector).click();
    cy.get("#abbruchverpflichtungsjahr")
      .clear()
      .type(
        inputData.gebaeude.abbruchverpflichtungsjahr.abbruchverpflichtungsjahr
      );
    cy.get(submitBtnSelector).click();
    cy.get("#wohnflaeche")
      .clear()
      .type(inputData.gebaeude.wohnflaeche.wohnflaeche);
    cy.get(submitBtnSelector).click();
    cy.get(
      `label[for=hasWeitereWohnraeume-${inputData.gebaeude.weitereWohnraeume.hasWeitereWohnraeume}]`
    ).click();
    cy.get(submitBtnSelector).click();
    cy.get("#anzahl")
      .clear()
      .type(inputData.gebaeude.weitereWohnraeumeDetails.anzahl);
    cy.get("#flaeche")
      .clear()
      .type(inputData.gebaeude.weitereWohnraeumeDetails.flaeche);
    cy.get(submitBtnSelector).click();
    cy.get(
      `label[for=hasGaragen-${inputData.gebaeude.garagen.hasGaragen}]`
    ).click();
    cy.get(submitBtnSelector).click();
    cy.get("#anzahlGaragen")
      .clear()
      .type(inputData.gebaeude.garagenAnzahl.anzahlGaragen);
    cy.get(submitBtnSelector).click();

    cy.url().should("include", "/formular/eigentuemer");
    cy.contains("h1", "Bereich: Eigentümer:in");
    cy.get(submitBtnSelector).click();
    cy.get("#anzahl").select(inputData.eigentuemer.anzahl.anzahl);
    cy.get(submitBtnSelector).click();
    cy.get("label[for=areVerheiratet-true]").click();
    cy.get(submitBtnSelector).click();
    // PERSON 1
    cy.get("#anrede").select(inputData.eigentuemer.person1.angaben.anrede);
    cy.get("#titel").clear().type(inputData.eigentuemer.person1.angaben.titel);
    cy.get("#name").clear().type(inputData.eigentuemer.person1.angaben.name);
    cy.get("#vorname")
      .clear()
      .type(inputData.eigentuemer.person1.angaben.vorname);
    cy.get("#geburtsdatum")
      .clear()
      .type(inputData.eigentuemer.person1.angaben.geburtsdatum);
    cy.get(submitBtnSelector).click();
    cy.get("#strasse")
      .clear()
      .type(inputData.eigentuemer.person1.adresse.strasse);
    cy.get("#hausnummer")
      .clear()
      .type(inputData.eigentuemer.person1.adresse.hausnummer);
    cy.get("#plz").clear().type(inputData.eigentuemer.person1.adresse.plz);
    cy.get("#ort").clear().type(inputData.eigentuemer.person1.adresse.ort);
    cy.get("#telefonnummer")
      .clear()
      .type(inputData.eigentuemer.person1.adresse.telefonnummer);
    cy.get(submitBtnSelector).click();
    cy.url().should("include", "/person/1/steuerId");
    cy.get("#steuerId").should("exist");
    cy.get(submitBtnSelector).click();
    cy.get("label[for=hasVertreter-true]").click();
    cy.get(submitBtnSelector).click();
    cy.get("#anrede").select(
      inputData.eigentuemer.person1.vertreter.name.anrede
    );
    cy.get("#titel")
      .clear()
      .type(inputData.eigentuemer.person1.vertreter.name.titel);
    cy.get("#name")
      .clear()
      .type(inputData.eigentuemer.person1.vertreter.name.name);
    cy.get("#vorname")
      .clear()
      .type(inputData.eigentuemer.person1.vertreter.name.vorname);
    cy.get(submitBtnSelector).click();
    cy.get("#strasse")
      .clear()
      .type(inputData.eigentuemer.person1.vertreter.adresse.strasse);
    cy.get("#hausnummer")
      .clear()
      .type(inputData.eigentuemer.person1.vertreter.adresse.hausnummer);
    cy.get("#plz")
      .clear()
      .type(inputData.eigentuemer.person1.vertreter.adresse.plz);
    cy.get("#ort")
      .clear()
      .type(inputData.eigentuemer.person1.vertreter.adresse.ort);
    cy.get("#telefonnummer")
      .clear()
      .type(inputData.eigentuemer.person1.vertreter.adresse.telefonnummer);
    cy.get(submitBtnSelector).click();
    cy.url().should("include", "/formular/eigentuemer/person/1/anteil");
    cy.get("#userInput")
      .clear()
      .type(
        `${inputData.eigentuemer.person1.anteil.zaehler}/${inputData.eigentuemer.person1.anteil.nenner}`
      );
    cy.get(submitBtnSelector).click();

    // PERSON 2
    cy.url().should("include", "/formular/eigentuemer/person/2/");
    cy.get("#anrede").select(inputData.eigentuemer.person2.angaben.anrede);
    cy.get("#titel").clear().type(inputData.eigentuemer.person2.angaben.titel);
    cy.get("#name").clear().type(inputData.eigentuemer.person2.angaben.name);
    cy.get("#vorname")
      .clear()
      .type(inputData.eigentuemer.person2.angaben.vorname);
    cy.get("#geburtsdatum")
      .clear()
      .type(inputData.eigentuemer.person2.angaben.geburtsdatum);
    cy.get(submitBtnSelector).click();
    cy.get("#strasse")
      .clear()
      .type(inputData.eigentuemer.person2.adresse.strasse);
    cy.get("#hausnummer")
      .clear()
      .type(inputData.eigentuemer.person2.adresse.hausnummer);
    cy.get("#plz").clear().type(inputData.eigentuemer.person2.adresse.plz);
    cy.get("#ort").clear().type(inputData.eigentuemer.person2.adresse.ort);
    cy.get("#telefonnummer")
      .clear()
      .type(inputData.eigentuemer.person2.adresse.telefonnummer);
    cy.get(submitBtnSelector).click();
    cy.url().should("include", "/person/2/steuerId");
    cy.get("#steuerId")
      .clear()
      .type(inputData.eigentuemer.person2.steuerId.steuerId);
    cy.get(submitBtnSelector).click();
    cy.get("label[for=hasVertreter-false]").click();
    cy.get(submitBtnSelector).click();
    cy.url().should("include", "/formular/eigentuemer/person/2/anteil");
    cy.get("label[for='zaehlerNenner-1/2']").click();
    cy.get(submitBtnSelector).click();

    cy.get("label[for=hasEmpfangsvollmacht-true]").click();
    cy.get(submitBtnSelector).click();
    cy.get("#anrede").select(
      inputData.eigentuemer.empfangsbevollmaechtigter.name.anrede
    );
    cy.get("#name")
      .clear()
      .type(inputData.eigentuemer.empfangsbevollmaechtigter.name.name);
    cy.get("#vorname")
      .clear()
      .type(inputData.eigentuemer.empfangsbevollmaechtigter.name.vorname);
    cy.get(submitBtnSelector).click();
    cy.get("#strasse")
      .clear()
      .type(inputData.eigentuemer.empfangsbevollmaechtigter.adresse.strasse);
    cy.get("#hausnummer")
      .clear()
      .type(inputData.eigentuemer.empfangsbevollmaechtigter.adresse.hausnummer);
    cy.get("#plz")
      .clear()
      .type(inputData.eigentuemer.empfangsbevollmaechtigter.adresse.plz);
    cy.get("#ort")
      .clear()
      .type(inputData.eigentuemer.empfangsbevollmaechtigter.adresse.ort);
    cy.get("#telefonnummer")
      .clear()
      .type(
        inputData.eigentuemer.empfangsbevollmaechtigter.adresse.telefonnummer
      );
    cy.get(submitBtnSelector).click();
    cy.url().should("include", "/formular/eigentuemer/abschluss");
    cy.contains("h1", "fast fertig");
    cy.get("#freitext").clear().type(inputData.freitext);
    cy.get(submitBtnSelector).click();

    // ZUSAMMENFASSUNG
    cy.url().should("include", "/formular/zusammenfassung");

    // unpack accordion items
    cy.contains("summary", "Grundstück").click();
    cy.contains("#grundstueck-area dt", "Art des Grundstücks");
    cy.contains("#grundstueck-area dd", "Eigentumswohnung");

    cy.contains("summary", "Gebäude").click();
    cy.contains("#gebaeude-area dt", "Auswahl Baujahr");
    cy.contains("#gebaeude-area dd", "Nach 1949");

    cy.contains("summary", "Eigentümer:innen").click();
    cy.contains("#eigentuemer-area dt", "Anzahl");
    cy.contains("#eigentuemer-area dd", inputData.eigentuemer.anzahl.anzahl);
    cy.contains("#person-0", "Frau");
    cy.contains(
      "#person-0-vertreter",
      inputData.eigentuemer.person1.vertreter.name.name
    );
    cy.contains(
      "#person-1",
      inputData.eigentuemer.person2.angaben.geburtsdatum
    );
    cy.contains(
      "#empfangsbevollmaechtigter",
      inputData.eigentuemer.empfangsbevollmaechtigter.adresse.strasse
    );

    cy.contains("summary", "Ergänzende Angaben").click();
    cy.contains("#freitext-area", inputData.freitext);

    cy.get("label[for=confirmCompleteCorrect]").click("left");
    cy.get("label[for=confirmDataPrivacy]").click("left");
    cy.get("label[for=confirmTermsOfUse]").click("left");

    cy.get(submitBtnSelector).click();
    cy.contains("erfolgreich versendet", { timeout: 5000 });
    cy.contains("et036422myggf53jxax8uy92dmvkete8");

    cy.contains("a", "Transferticket")
      .should("have.attr", "href")
      .and("include", "download/transferticket");

    cy.contains("a", "PDF")
      .should("have.attr", "href")
      .and("include", "download/pdf");
    cy.get("main").contains("a", "Weitere Erklärung").click();

    cy.get(`label[for=datenUebernehmen-true]`).click();
    cy.get(submitBtnSelector).click();

    cy.contains(
      "Prüfen Sie in wenigen Schritten, ob Sie unseren Online-Dienst nutzen können."
    );
  });
});
