/// <reference types="cypress" />

const inputData = {
  grundstueck: {
    adresse: {
      strasse: "Hauptstraße",
      hausnummer: "24b",
      zusatzangaben: "2. OG re.",
      plz: "01001",
      ort: "Au",
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
        flur: "456",
        flurstueckZaehler: "2345",
        flurstueckNenner: "9876",
        wirtschaftlicheEinheitZaehler: "1",
        wirtschaftlicheEinheitNenner: "234",
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
    wohnflaeche: {
      wohnflaeche: "24",
    },
    weitereWohnraeume: {
      hasWeitereWohnraeume: "true",
    },
    weitereWohnraeumeFlaeche: {
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
        anrede: "Frau",
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
      },
      telefonnummer: {
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
          anrede: "Herr",
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
        },
        telefonnummer: {
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
        anrede: "Herr",
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
      },
      telefonnummer: {
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
    freitext: "Ich fand die Plattform ganz toll.",
  },
};

export const submitBtnSelector = "#nextButton";

describe("Happy Path", () => {
  it("Enter data for two eigentuemer", () => {
    cy.visit("/");
    cy.get("[data-testid='start-formular']").click();

    cy.url().should("include", "/formular/grundstueck/adresse");
    cy.get("#strasse").clear().type(inputData.grundstueck.adresse.strasse);
    cy.get("#hausnummer")
      .clear()
      .type(inputData.grundstueck.adresse.hausnummer);
    cy.get("#zusatzangaben")
      .clear()
      .type(inputData.grundstueck.adresse.zusatzangaben);
    cy.get("#plz").clear().type(inputData.grundstueck.adresse.plz);
    cy.get("#ort").clear().type(inputData.grundstueck.adresse.ort);
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
    cy.get("#flur").clear().type(inputData.grundstueck.flurstueck.angaben.flur);
    cy.get("#flurstueckZaehler")
      .clear()
      .type(inputData.grundstueck.flurstueck.angaben.flurstueckZaehler);
    cy.get("#flurstueckNenner")
      .clear()
      .type(inputData.grundstueck.flurstueck.angaben.flurstueckNenner);
    cy.get("#wirtschaftlicheEinheitZaehler")
      .clear()
      .type(
        inputData.grundstueck.flurstueck.angaben.wirtschaftlicheEinheitZaehler
      );
    cy.get("#wirtschaftlicheEinheitNenner")
      .clear()
      .type(
        inputData.grundstueck.flurstueck.angaben.wirtschaftlicheEinheitNenner
      );
    cy.get("#groesseHa")
      .clear()
      .type(inputData.grundstueck.flurstueck.angaben.groesseHa);
    cy.get("#groesseA")
      .clear()
      .type(inputData.grundstueck.flurstueck.angaben.groesseA);
    cy.get("#groesseQm")
      .clear()
      .type(inputData.grundstueck.flurstueck.angaben.groesseQm);
    cy.get(submitBtnSelector).click();

    cy.url().should("include", "/formular/grundstueck/flurstueck/2/angaben");
    cy.get("#grundbuchblattnummer")
      .clear()
      .type(inputData.grundstueck.flurstueck.angaben.grundbuchblattnummer);
    cy.get("#gemarkung")
      .clear()
      .type(inputData.grundstueck.flurstueck.angaben.gemarkung);
    cy.get("#flur").clear().type(inputData.grundstueck.flurstueck.angaben.flur);
    cy.get("#flurstueckZaehler")
      .clear()
      .type(inputData.grundstueck.flurstueck.angaben.flurstueckZaehler);
    cy.get("#flurstueckNenner")
      .clear()
      .type(inputData.grundstueck.flurstueck.angaben.flurstueckNenner);
    cy.get("#wirtschaftlicheEinheitZaehler")
      .clear()
      .type(
        inputData.grundstueck.flurstueck.angaben.wirtschaftlicheEinheitZaehler
      );
    cy.get("#wirtschaftlicheEinheitNenner")
      .clear()
      .type(
        inputData.grundstueck.flurstueck.angaben.wirtschaftlicheEinheitNenner
      );
    cy.get("#groesseHa")
      .clear()
      .type(inputData.grundstueck.flurstueck.angaben.groesseHa);
    cy.get("#groesseA")
      .clear()
      .type(inputData.grundstueck.flurstueck.angaben.groesseA);
    cy.get("#groesseQm")
      .clear()
      .type(inputData.grundstueck.flurstueck.angaben.groesseQm);
    cy.get(submitBtnSelector).click();

    cy.url().should("include", "/formular/grundstueck/bodenrichtwert");
    cy.get("#bodenrichtwert")
      .clear()
      .type(inputData.grundstueck.bodenrichtwert.bodenrichtwert);
    cy.get(submitBtnSelector).click();

    cy.url().should("include", "/formular/gebaeude/ab1949");
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
    cy.get("#wohnflaeche")
      .clear()
      .type(inputData.gebaeude.wohnflaeche.wohnflaeche);
    cy.get(submitBtnSelector).click();
    cy.get(
      `label[for=hasWeitereWohnraeume-${inputData.gebaeude.weitereWohnraeume.hasWeitereWohnraeume}]`
    ).click();
    cy.get(submitBtnSelector).click();
    cy.get("#flaeche")
      .clear()
      .type(inputData.gebaeude.weitereWohnraeumeFlaeche.flaeche);
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
    cy.get("#anrede")
      .clear()
      .type(inputData.eigentuemer.person1.angaben.anrede);
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
    cy.get(submitBtnSelector).click();
    cy.get("#telefonnummer")
      .clear()
      .type(inputData.eigentuemer.person1.telefonnummer.telefonnummer);
    cy.get(submitBtnSelector).click();
    cy.get("#steuerId")
      .clear()
      .type(inputData.eigentuemer.person1.steuerId.steuerId);
    cy.get(submitBtnSelector).click();
    cy.get("#hasVertreter-true").click();
    cy.get(submitBtnSelector).click();
    cy.get("#anrede")
      .clear()
      .type(inputData.eigentuemer.person1.vertreter.name.anrede);
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
    cy.get(submitBtnSelector).click();
    cy.get("#telefonnummer")
      .clear()
      .type(
        inputData.eigentuemer.person1.vertreter.telefonnummer.telefonnummer
      );
    cy.get(submitBtnSelector).click();
    cy.get("#zaehler")
      .clear()
      .type(inputData.eigentuemer.person1.anteil.zaehler);
    cy.get("#nenner").clear().type(inputData.eigentuemer.person1.anteil.nenner);
    cy.get(submitBtnSelector).click();

    // PERSON 2
    cy.url().should("include", "/formular/eigentuemer/person/2/");
    cy.get("#anrede")
      .clear()
      .type(inputData.eigentuemer.person2.angaben.anrede);
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
    cy.get(submitBtnSelector).click();
    cy.get("#telefonnummer")
      .clear()
      .type(inputData.eigentuemer.person2.telefonnummer.telefonnummer);
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

    cy.get("#freitext").clear().type(inputData.eigentuemer.freitext);
    cy.get(submitBtnSelector).click();

    // ZUSAMMENFASSUNG
    cy.url().should("include", "/formular/zusammenfassung");
    cy.contains("Bezugsfertig ab 1949: Ja");
    cy.contains(`Baujahr: ${inputData.gebaeude.baujahr.baujahr}`);
    cy.contains("Kernsaniert: Ja");
    cy.contains(
      `Jahr der Kernsanierung: ${inputData.gebaeude.kernsanierungsjahr.kernsanierungsjahr}`
    );
    cy.contains(`Wohnfläche: ${inputData.gebaeude.wohnflaeche.wohnflaeche} m2`);
    cy.contains(`Weitere Wohnräume: Ja`);
    cy.contains(
      `Gesamtfläche der weiteren Wohnräume: ${inputData.gebaeude.weitereWohnraeumeFlaeche.flaeche} m2`
    );
    cy.contains(
      `Anzahl Garagen: ${inputData.gebaeude.garagenAnzahl.anzahlGaragen}`
    );

    cy.contains("Anzahl: " + inputData.eigentuemer.anzahl.anzahl);
    cy.contains("Verheiratet: Ja");
    cy.get("#person-0").contains(
      "Anrede: " + inputData.eigentuemer.person1.angaben.anrede
    );
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
      "Telefonnummer: " +
        inputData.eigentuemer.person1.telefonnummer.telefonnummer
    );
    cy.get("#person-0").contains(
      "Steuer-ID: " + inputData.eigentuemer.person1.steuerId.steuerId
    );
    cy.get("#person-0").contains("Gesetzlicher Vertreter: Ja");
    cy.get("#person-0-vertreter").contains(
      "Anrede: " + inputData.eigentuemer.person1.vertreter.name.anrede
    );
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
        inputData.eigentuemer.person1.vertreter.telefonnummer.telefonnummer
    );
    cy.get("#person-0").contains(
      "Anteil Zähler: " + inputData.eigentuemer.person1.anteil.zaehler
    );
    cy.get("#person-0").contains(
      "Anteil Nenner: " + inputData.eigentuemer.person1.anteil.nenner
    );

    cy.get("#person-1").contains(
      "Anrede: " + inputData.eigentuemer.person2.angaben.anrede
    );
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
      "Telefonnummer: " +
        inputData.eigentuemer.person2.telefonnummer.telefonnummer
    );
    cy.get("#person-1").contains(
      "Steuer-ID: " + inputData.eigentuemer.person2.steuerId.steuerId
    );
    cy.get("#person-1").contains("Gesetzlicher Vertreter: Nein");
    cy.get("#person-1").contains(
      "Anteil Zähler: " + inputData.eigentuemer.person2.anteil.zaehler
    );
    cy.get("#person-1").contains(
      "Anteil Nenner: " + inputData.eigentuemer.person2.anteil.nenner
    );
  });
});
