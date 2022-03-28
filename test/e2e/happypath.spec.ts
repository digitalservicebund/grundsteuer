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
      steuernummer: "1234567890",
    },
    typ: {
      typ: "einfamilienhaus",
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
        wirtschaftlicheEinheitZaehler: "1",
        wirtschaftlicheEinheitNenner: "234",
      },
      groesse: {
        groesseHa: "1",
        groesseA: "2",
        groesseQm: "300",
      },
    },
    bodenrichtwert: {
      bodenrichtwert: "200",
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
      abbruchverpflichtungsjahr: "2010",
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
        geburtsdatum: "10112000",
      },
      adresse: {
        strasse: "Baker St.",
        hausnummer: "221b",
        postfach: "",
        plz: "12345",
        ort: "London",
        telefonnummer: "555-2368",
      },
      steuerId: {
        steuerId: "04452397687",
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
        geburtsdatum: "01101990",
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
  it("Enter data for two eigentuemer", () => {
    cy.login();
    cy.visit("/formular/welcome");
    cy.get(submitBtnSelector).click();
    cy.get("h1").contains("Grundstück", { timeout: 5000 });
    cy.get(submitBtnSelector).click();
    cy.get("h1").contains("Wie lautet die Adresse des Grundstücks?", {
      timeout: 5000,
    });
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

    cy.url().should("include", "/formular/grundstueck/typ");
    cy.get(`label[for=typ-${inputData.grundstueck.typ.typ}]`).click();
    cy.get(submitBtnSelector).click();

    cy.url().should("include", "/formular/grundstueck/gemeinde");
    cy.get(
      `label[for=innerhalbEinerGemeinde-${inputData.grundstueck.gemeinde.innerhalbEinerGemeinde}]`
    ).click();
    cy.get(submitBtnSelector).click();

    cy.url().should("include", "/formular/grundstueck/anzahl");
    cy.get("#anzahl").select(inputData.grundstueck.anzahl.anzahl);
    cy.get(submitBtnSelector).click();

    cy.url().should("include", "/formular/grundstueck/flurstueck/1/angaben");
    cy.get("#grundbuchblattnummer")
      .clear()
      .type(inputData.grundstueck.flurstueck.angaben.grundbuchblattnummer);
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
    cy.get("#wirtschaftlicheEinheitZaehler")
      .clear()
      .type(
        inputData.grundstueck.flurstueck.flur.wirtschaftlicheEinheitZaehler
      );
    cy.get("#wirtschaftlicheEinheitNenner")
      .clear()
      .type(inputData.grundstueck.flurstueck.flur.wirtschaftlicheEinheitNenner);
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
    cy.get("#grundbuchblattnummer")
      .clear()
      .type(inputData.grundstueck.flurstueck.angaben.grundbuchblattnummer);
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
    cy.get("#wirtschaftlicheEinheitZaehler")
      .clear()
      .type(
        inputData.grundstueck.flurstueck.flur.wirtschaftlicheEinheitZaehler
      );
    cy.get("#wirtschaftlicheEinheitNenner")
      .clear()
      .type(inputData.grundstueck.flurstueck.flur.wirtschaftlicheEinheitNenner);
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

    cy.url().should("include", "/formular/grundstueck/bodenrichtwert");
    cy.get("#bodenrichtwert")
      .clear()
      .type(inputData.grundstueck.bodenrichtwert.bodenrichtwert);
    cy.get(submitBtnSelector).click();

    cy.url().should("include", "/formular/gebaeude/uebersicht");
    cy.get("h1").contains("Gebäude", { timeout: 5000 });
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
    cy.get("#steuerId")
      .clear()
      .type(inputData.eigentuemer.person1.steuerId.steuerId);
    cy.get(submitBtnSelector).click();
    cy.get("#hasVertreter-true").click();
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
    cy.get("#zaehler")
      .clear()
      .type(inputData.eigentuemer.person1.anteil.zaehler);
    cy.get("#nenner").clear().type(inputData.eigentuemer.person1.anteil.nenner);
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
    cy.get("#steuerId")
      .clear()
      .type(inputData.eigentuemer.person2.steuerId.steuerId);
    cy.get(submitBtnSelector).click();
    cy.get("#hasVertreter-false").click();
    cy.get(submitBtnSelector).click();
    cy.get("#zaehler")
      .clear()
      .type(inputData.eigentuemer.person2.anteil.zaehler);
    cy.get("#nenner").clear().type(inputData.eigentuemer.person2.anteil.nenner);
    cy.get(submitBtnSelector).click();

    cy.get("#hasEmpfangsvollmacht-true").click();
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

    // ZUSAMMENFASSUNG
    cy.url().should("include", "/formular/zusammenfassung");

    cy.get("#freitext").clear().type(inputData.freitext);

    cy.contains("Bezugsfertig ab 1949: Ja");
    cy.contains(`Baujahr: ${inputData.gebaeude.baujahr.baujahr}`);
    cy.contains("Kernsaniert: Ja");
    cy.contains(
      `Jahr der Kernsanierung: ${inputData.gebaeude.kernsanierungsjahr.kernsanierungsjahr}`
    );
    cy.contains("Abbruchverpflichtung liegt vor: Ja");
    cy.contains(
      `Jahr der Abbruchverpflichtung: ${inputData.gebaeude.abbruchverpflichtungsjahr.abbruchverpflichtungsjahr}`
    );
    cy.contains(`Wohnfläche: ${inputData.gebaeude.wohnflaeche.wohnflaeche} m2`);
    cy.contains(`Weitere Wohnräume: Ja`);
    cy.contains(
      `Anzahl der weiteren Wohnräume: ${inputData.gebaeude.weitereWohnraeumeDetails.anzahl}`
    );
    cy.contains(
      `Gesamtfläche der weiteren Wohnräume: ${inputData.gebaeude.weitereWohnraeumeDetails.flaeche} m2`
    );
    cy.contains(
      `Anzahl Garagen: ${inputData.gebaeude.garagenAnzahl.anzahlGaragen}`
    );

    cy.contains("Anzahl: " + inputData.eigentuemer.anzahl.anzahl);
    cy.contains("Verheiratet: Ja");
    cy.get("#person-0").contains("Anrede: Frau");
    cy.get("#person-0").contains(
      "Titel: " + inputData.eigentuemer.person1.angaben.titel
    );
    cy.get("#person-0").contains(
      "Name: " + inputData.eigentuemer.person1.angaben.name
    );
    cy.get("#person-0").contains(
      "Vorname: " + inputData.eigentuemer.person1.angaben.vorname
    );
    cy.get("#person-0").contains(
      "Geburtsdatum: " + inputData.eigentuemer.person1.angaben.geburtsdatum
    );
    cy.get("#person-0").contains(
      "Straße: " + inputData.eigentuemer.person1.adresse.strasse
    );
    cy.get("#person-0").contains(
      "Hausnummer: " + inputData.eigentuemer.person1.adresse.hausnummer
    );
    cy.get("#person-0").contains(
      "PLZ: " + inputData.eigentuemer.person1.adresse.plz
    );
    cy.get("#person-0").contains(
      "Ort: " + inputData.eigentuemer.person1.adresse.ort
    );
    cy.get("#person-0").contains(
      "Telefonnummer: " + inputData.eigentuemer.person1.adresse.telefonnummer
    );
    cy.get("#person-0").contains("Steuer-ID: 04 452 397 687");
    cy.get("#person-0").contains("Gesetzlicher Vertreter: Ja");
    cy.get("#person-0-vertreter").contains("Anrede: Herr");
    cy.get("#person-0-vertreter").contains(
      "Titel: " + inputData.eigentuemer.person1.vertreter.name.titel
    );
    cy.get("#person-0-vertreter").contains(
      "Name: " + inputData.eigentuemer.person1.vertreter.name.name
    );
    cy.get("#person-0-vertreter").contains(
      "Vorname: " + inputData.eigentuemer.person1.vertreter.name.vorname
    );
    cy.get("#person-0-vertreter").contains(
      "Straße: " + inputData.eigentuemer.person1.vertreter.adresse.strasse
    );
    cy.get("#person-0-vertreter").contains(
      "Hausnummer: " +
        inputData.eigentuemer.person1.vertreter.adresse.hausnummer
    );
    cy.get("#person-0-vertreter").contains(
      "PLZ: " + inputData.eigentuemer.person1.vertreter.adresse.plz
    );
    cy.get("#person-0-vertreter").contains(
      "Ort: " + inputData.eigentuemer.person1.vertreter.adresse.ort
    );
    cy.get("#person-0-vertreter").contains(
      "Telefonnummer: " +
        inputData.eigentuemer.person1.vertreter.adresse.telefonnummer
    );
    cy.get("#person-0").contains(
      "Anteil Zähler: " + inputData.eigentuemer.person1.anteil.zaehler
    );
    cy.get("#person-0").contains(
      "Anteil Nenner: " + inputData.eigentuemer.person1.anteil.nenner
    );

    cy.get("#person-1").contains("Anrede: Keine");
    cy.get("#person-1").contains(
      "Titel: " + inputData.eigentuemer.person2.angaben.titel
    );
    cy.get("#person-1").contains(
      "Name: " + inputData.eigentuemer.person2.angaben.name
    );
    cy.get("#person-1").contains(
      "Vorname: " + inputData.eigentuemer.person2.angaben.vorname
    );
    cy.get("#person-1").contains(
      "Geburtsdatum: " + inputData.eigentuemer.person2.angaben.geburtsdatum
    );
    cy.get("#person-1").contains(
      "Straße: " + inputData.eigentuemer.person2.adresse.strasse
    );
    cy.get("#person-1").contains(
      "Hausnummer: " + inputData.eigentuemer.person2.adresse.hausnummer
    );
    cy.get("#person-1").contains(
      "PLZ: " + inputData.eigentuemer.person2.adresse.plz
    );
    cy.get("#person-1").contains(
      "Ort: " + inputData.eigentuemer.person2.adresse.ort
    );
    cy.get("#person-1").contains(
      "Telefonnummer: " + inputData.eigentuemer.person2.adresse.telefonnummer
    );
    cy.get("#person-1").contains("Steuer-ID: 02 293 417 683");
    cy.get("#person-1").contains("Gesetzlicher Vertreter: Nein");
    cy.get("#person-1").contains(
      "Anteil Zähler: " + inputData.eigentuemer.person2.anteil.zaehler
    );
    cy.get("#person-1").contains(
      "Anteil Nenner: " + inputData.eigentuemer.person2.anteil.nenner
    );

    cy.contains("Empfangsvollmacht: Ja");
    cy.get("#empfangsbevollmaechtigter").contains("Anrede: Frau");
    cy.get("#empfangsbevollmaechtigter").contains(
      "Name: " + inputData.eigentuemer.empfangsbevollmaechtigter.name.name
    );
    cy.get("#empfangsbevollmaechtigter").contains(
      "Vorname: " + inputData.eigentuemer.empfangsbevollmaechtigter.name.vorname
    );
    cy.get("#empfangsbevollmaechtigter").contains(
      "Straße: " +
        inputData.eigentuemer.empfangsbevollmaechtigter.adresse.strasse
    );
    cy.get("#empfangsbevollmaechtigter").contains(
      "Hausnummer: " +
        inputData.eigentuemer.empfangsbevollmaechtigter.adresse.hausnummer
    );
    cy.get("#empfangsbevollmaechtigter").contains(
      "PLZ: " + inputData.eigentuemer.empfangsbevollmaechtigter.adresse.plz
    );
    cy.get("#empfangsbevollmaechtigter").contains(
      "Ort: " + inputData.eigentuemer.empfangsbevollmaechtigter.adresse.ort
    );
    cy.get("#empfangsbevollmaechtigter").contains(
      "Telefonnummer: " +
        inputData.eigentuemer.empfangsbevollmaechtigter.adresse.telefonnummer
    );
  });
});
